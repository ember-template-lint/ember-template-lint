#!/usr/bin/env node
/* eslint require-atomic-updates:"off" */
// @ts-check
// Use V8's code cache to speed up instantiation time:
import 'v8-compile-cache'; // eslint-disable-line import/no-unassigned-import

import {
  compactTodoStorageFile,
  getTodoStorageFilePath,
  getTodoConfig,
  validateConfig,
} from '@lint-todo/utils';
import getStdin from 'get-stdin';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { Worker, SHARE_ENV } from 'node:worker_threads';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { parseArgv, getFilesToLint } from '../lib/helpers/cli.js';
import printResults from '../lib/helpers/print-results.js';
import processResults from '../lib/helpers/process-results.js';
import Linter from '../lib/linter.js';
import { getProjectConfig } from '../lib/get-config.js';
import { processWithPool } from '../lib/-private/process-with-pool.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Resolve the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let hasWorkerInDistFolder = fs.existsSync(path.resolve(__dirname, '../dist/lint-worker.js'));

const STDIN = '/dev/stdin';
const MIN_FILES_TO_USE_WORKERS = 100;
let amountOfFilesPerWorker = MIN_FILES_TO_USE_WORKERS;

const NOOP_CONSOLE = {
  log: () => {},
  warn: () => {},
  error: () => {},
};

function removeExt(filePath) {
  return filePath.slice(0, -path.extname(filePath).length);
}

async function buildLinterOptions(workingDir, filePath, filename = '', stdin) {
  if (stdin) {
    let filePath = filename;
    let moduleId = removeExt(filePath);
    let source = stdin;

    return { source, filePath, moduleId };
  } else {
    let moduleId = removeExt(filePath);
    let resolvedFilePath = path.resolve(workingDir, filePath);
    let source = await readFile(resolvedFilePath, { encoding: 'utf8' });

    return { source, filePath, moduleId };
  }
}

function getTodoConfigFromCommandLineOptions(options) {
  let todoConfig = {};

  if (Number.isInteger(options.todoDaysToWarn)) {
    todoConfig.warn = options.todoDaysToWarn || undefined;
  }

  if (Number.isInteger(options.todoDaysToError)) {
    todoConfig.error = options.todoDaysToError || undefined;
  }

  return todoConfig;
}

function _isOverridingConfig(options) {
  let defaultArgs = parseArgv(['fake-file-to-get-default-options.hbs']);

  return Boolean(
    options.config !== defaultArgs.config ||
      options.rule !== defaultArgs.rule ||
      options.inlineConfig !== defaultArgs.inlineConfig ||
      options.configPath !== defaultArgs.configPath
  );
}

function _todoStorageDirExists(baseDir) {
  try {
    return fs.lstatSync(getTodoStorageFilePath(baseDir)).isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

async function run() {
  let options = parseArgv(process.argv.slice(2));
  let positional = options._;
  let config;
  let isOverridingConfig = _isOverridingConfig(options);
  let shouldWriteToStdout = !(options.quiet || ['sarif', 'json'].includes(options.format));
  let _console = shouldWriteToStdout ? console : NOOP_CONSOLE;

  if (options.config) {
    try {
      config = JSON.parse(options.config);
    } catch {
      console.error('Could not parse specified `--config` as JSON');
      process.exitCode = 1;
      return;
    }
  }

  if (options['no-config-path'] !== undefined) {
    options.configPath = false;
  }

  let todoConfigResult = validateConfig(options.workingDirectory);

  if (!todoConfigResult.isValid) {
    console.error(todoConfigResult.message);
    process.exitCode = 1;
    return;
  }

  if (_todoStorageDirExists(options.workingDirectory)) {
    console.error(
      'Found `.lint-todo` directory. Please run `npx @lint-todo/migrator .` to convert to the new todo file format'
    );
    process.exitCode = 1;
    return;
  }

  if (options.compactTodo) {
    let { compacted } = compactTodoStorageFile(options.workingDirectory);
    _console.log(`Removed ${compacted} todos in .lint-todo storage file`);
    process.exitCode = 0;
    return;
  }

  let linter;
  let todoInfo = {
    added: 0,
    removed: 0,
    todoConfig: getTodoConfig(
      options.workingDirectory,
      'ember-template-lint',
      getTodoConfigFromCommandLineOptions(options)
    ),
  };

  try {
    linter = new Linter({
      workingDir: options.workingDirectory,
      configPath: options.configPath,
      config,
      rule: options.rule,
      allowInlineConfig: !options.noInlineConfig,
      checkHbsTemplateLiterals: options.checkHbsTemplateLiterals,
      reportUnusedDisableDirectives: options.reportUnusedDisableDirectives,
      console: _console,
    });
    await linter.getConfig();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  if ((options.todoDaysToWarn || options.todoDaysToError) && !options.updateTodo) {
    console.error(
      'Using `--todo-days-to-warn` or `--todo-days-to-error` is only valid when the `--update-todo` option is being used.'
    );
    process.exitCode = 1;
    return;
  }

  let filePaths;
  try {
    let config = await getProjectConfig(options.workingDirectory, options);
    filePaths = getFilesToLint(
      options.workingDirectory,
      positional,
      options.ignorePattern,
      options.errorOnUnmatchedPattern !== false,
      config,
      _console
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  let resultsAccumulator = [];
  let debug = process.env.DEBUG === 'ember-template-lint';

  const filePathsArray = [...filePaths];

  const isReadingStdin = filePaths.has(STDIN);
  const maybeStdin = isReadingStdin ? await getStdin() : undefined;

  // Handle --print-config option early, as it should exit immediately
  if (options.printConfig) {
    if (filePathsArray.length > 1) {
      console.error('The --print-config option must be used with exactly one file name.');
      process.exitCode = 1;
      return;
    }

    const relativeFilePath = filePathsArray[0];
    let linterOptions = await buildLinterOptions(
      options.workingDirectory,
      relativeFilePath,
      options.filename,
      maybeStdin
    );

    let fileConfig = await linter.getConfigForFile(linterOptions);
    _console.log(JSON.stringify(fileConfig, null, 2));
    process.exitCode = 0;
    return;
  }

  // Process a single file and return its results
  async function processFile(relativeFilePath) {
    let linterOptions = await buildLinterOptions(
      options.workingDirectory,
      relativeFilePath,
      options.filename,
      maybeStdin
    );

    let fileResults;

    if (options.fix) {
      let { isFixed, output, messages } = await linter.verifyAndFix(linterOptions);
      if (isFixed) {
        await writeFile(linterOptions.filePath, output, { encoding: 'utf-8' });
      }
      fileResults = messages;
    } else {
      fileResults = await linter.verify(linterOptions);
    }

    // Return both the file path and its results to maintain ordering information
    return {
      filePath: relativeFilePath,
      linterOptions,
      results: fileResults,
    };
  }
  // Process files with worker threads or existing pool
  let allResults;
  if (!isReadingStdin && filePathsArray.length >= MIN_FILES_TO_USE_WORKERS) {
    // Use worker threads for parallel processing
    const cpuCount = os.cpus().length;
    const workerCount = Math.max(1, cpuCount - 1);
    amountOfFilesPerWorker = Math.ceil(filePathsArray.length / workerCount);
    if (amountOfFilesPerWorker < MIN_FILES_TO_USE_WORKERS) {
      // creating a worker is quite expensive, so, we need an minimal amount of files per worker
      // to get real performance benefits
      amountOfFilesPerWorker = MIN_FILES_TO_USE_WORKERS;
    }
    // Split files into batches
    const batches = [];
    for (let i = 0; i < filePathsArray.length; i += amountOfFilesPerWorker) {
      batches.push(filePathsArray.slice(i, i + amountOfFilesPerWorker));
    }

    // Process one batch in the main thread while workers handle the rest
    // this make sence because we already loaded bundle in the main thread
    const mainThreadBatch = batches.shift() ?? [];

    const workerPromises = batches.map((batch) => {
      return runWorker({
        filePaths: batch,
        options: structuredClone(options),
      });
    });
    const mainThreadPromise = processWithPool(mainThreadBatch, 10, processFile);

    const [mainThreadResults, ...workerResults] = await Promise.all([
      mainThreadPromise,
      ...workerPromises,
    ]);

    allResults = [...mainThreadResults, ...workerResults.flat()];
  } else {
    // Use existing pool for stdin or smaller file sets
    allResults = await processWithPool(filePathsArray, 10, processFile);
  }

  if (options.updateTodo) {
    for (const result of allResults) {
      let { addedCount, removedCount } = linter.updateTodo(
        result.linterOptions,
        result.results,
        todoInfo.todoConfig,
        isOverridingConfig
      );

      todoInfo.added += addedCount;
      todoInfo.removed += removedCount;
    }
  }

  if (!isReadingStdin && linter.configureTodos()) {
    for (const result of allResults) {
      result.results = linter.processTodos(
        result.linterOptions,
        result.results,
        todoInfo.todoConfig,
        options.fix || options.cleanTodo,
        isOverridingConfig
      );
    }
  }

  // Flatten all results into the accumulator
  for (const { results } of allResults) {
    resultsAccumulator.push(...results);
  }

  // Sort the resultsAccumulator to match the original file order in filePathsArray
  resultsAccumulator.sort((a, b) => {
    // Find the original index in filePathsArray for each result
    const indexA = filePathsArray.indexOf(a.filePath);
    const indexB = filePathsArray.indexOf(b.filePath);

    // Sort based on original position
    return indexA - indexB;
  });

  let results = processResults(resultsAccumulator);

  if (
    results.errorCount > 0 ||
    (!options.quiet && options.maxWarnings && results.warningCount > options.maxWarnings)
  ) {
    process.exitCode = 1;
  }
  if (debug) {
    const workerEnvInfo = Object.entries(process.env).filter(([key]) =>
      key.startsWith('lint_worker_')
    );
    const workerInfo = workerEnvInfo.reduce(
      (acc, [, value]) => {
        acc.count++;
        acc.time += Number(value);
        return acc;
      },
      { count: 1, time: performance.now() }
    );
    if (workerInfo.count > 1) {
      console.log(
        `Processed ${amountOfFilesPerWorker} files per batch in ${workerInfo.count} workers in ${workerInfo.time.toFixed(
          2
        )}ms`
      );
      console.log(`Average time per worker: ${(workerInfo.time / workerInfo.count).toFixed(2)}ms`);
    }
  }
  await printResults(results, { options, todoInfo, config: linter.config });
}

run();

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL(
        hasWorkerInDistFolder ? '../dist/lint-worker.js' : '../lib/-private/lint-worker.js',
        import.meta.url
      ),
      {
        env: SHARE_ENV,
        workerData: {
          filePaths: workerData.filePaths,
          options: workerData.options,
        },
      }
    );

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
