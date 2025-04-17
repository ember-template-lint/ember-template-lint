#!/usr/bin/env node
/* eslint require-atomic-updates:"off" */

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
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

import { parseArgv, getFilesToLint } from '../lib/helpers/cli.js';
import printResults from '../lib/helpers/print-results.js';
import processResults from '../lib/helpers/process-results.js';
import Linter from '../lib/linter.js';
import { getProjectConfig } from '../lib/get-config.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const STDIN = '/dev/stdin';
const BATCH_SIZE = 100;

const NOOP_CONSOLE = {
  log: () => {},
  warn: () => {},
  error: () => {},
};

function removeExt(filePath) {
  return filePath.slice(0, -path.extname(filePath).length);
}

async function buildLinterOptions(workingDir, filePath, filename = '', isReadingStdin) {
  if (isReadingStdin) {
    let filePath = filename;
    let moduleId = removeExt(filePath);
    let source = await getStdin();

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

class WorkerPool {
  constructor(size, options) {
    this.size = size;
    this.options = options;
    this.workers = [];
    this.workerPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../lib/worker.js');
    this.availableWorkers = [];
    this.pendingTasks = [];
  }

  async initialize() {
    // Ensure working directory is absolute
    const workingDir = path.resolve(this.options.workingDirectory);
    
    for (let i = 0; i < this.size; i++) {
      const worker = new Worker(this.workerPath, {
        // Set the working directory for the worker
        cwd: workingDir
      });
      
      // Handle worker stdout
      worker.on('message', (message) => {
        if (message.type === 'stdout') {
          const { method, args } = message;
          // Forward to main process console
          console[method](...args);
        }
      });
      
      await new Promise((resolve, reject) => {
        worker.on('message', (message) => {
          if (message.type === 'ready') {
            resolve();
          }
        });
        
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
        
        worker.postMessage({
          type: 'init',
          options: {
            ...this.options,
            workingDir,
            // Ensure config paths are absolute
            configPath: this.options.configPath ? path.resolve(workingDir, this.options.configPath) : this.options.configPath
          }
        });
      });

      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  async processBatch(fileBatch, options) {
    return new Promise((resolve, reject) => {
      const worker = this.availableWorkers.pop();
      
      if (!worker) {
        this.pendingTasks.push({ fileBatch, options, resolve, reject });
        return;
      }

      worker.once('message', (message) => {
        if (message.type === 'error') {
          reject(new Error(message.error));
          return;
        }

        if (message.type === 'results') {
          this.availableWorkers.push(worker);
          
          if (this.pendingTasks.length > 0) {
            const task = this.pendingTasks.shift();
            this.processBatch(task.fileBatch, task.options)
              .then(task.resolve)
              .catch(task.reject);
          }

          resolve(message);
        }
      });

      worker.postMessage({
        type: 'lint',
        options: {
          ...options,
          // Ensure working directory is passed to worker
          workingDir: this.options.workingDirectory
        },
        fileBatch
      });
    });
  }

  async terminate() {
    await Promise.all(this.workers.map(worker => worker.terminate()));
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

  let todoInfo = {
    added: 0,
    removed: 0,
    todoConfig: getTodoConfig(
      options.workingDirectory,
      'ember-template-lint',
      getTodoConfigFromCommandLineOptions(options)
    ),
  };

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

  if (options.printConfig) {
    if (filePaths.size > 1) {
      console.error('The --print-config option must be used with exactly one file name.');
      process.exitCode = 1;
      return;
    }
  }

  // Create worker pool
  const numWorkers = Math.min(require('os').cpus().length, Math.ceil(filePaths.size / BATCH_SIZE));
  const workerPool = new WorkerPool(numWorkers, options);
  await workerPool.initialize();

  let resultsAccumulator = [];
  let hasError = false;

  // Process files in batches
  const fileArray = Array.from(filePaths);
  const batches = [];
  
  for (let i = 0; i < fileArray.length; i += BATCH_SIZE) {
    const batch = fileArray.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (relativeFilePath) => {
      return buildLinterOptions(
        options.workingDirectory,
        relativeFilePath,
        options.filename,
        filePaths.has(STDIN)
      );
    });
    
    batches.push(Promise.all(batchPromises));
  }

  try {
    const batchResults = await Promise.all(
      batches.map(async (batchPromise) => {
        const fileBatch = await batchPromise;
        return workerPool.processBatch(fileBatch, {
          fix: options.fix,
          updateTodo: options.updateTodo,
          cleanTodo: options.cleanTodo,
          todoConfig: todoInfo.todoConfig,
          isOverridingConfig,
          isStdin: filePaths.has(STDIN)
        });
      })
    );

    for (const result of batchResults) {
      if (result.type === 'results') {
        resultsAccumulator.push(...result.results);
        todoInfo.added += result.todoAdded;
        todoInfo.removed += result.todoRemoved;
      }
    }
  } catch (error) {
    console.error(error.message);
    hasError = true;
  } finally {
    await workerPool.terminate();
  }

  if (hasError) {
    process.exitCode = 1;
    return;
  }

  let results = processResults(resultsAccumulator);

  if (
    results.errorCount > 0 ||
    (!options.quiet && options.maxWarnings && results.warningCount > options.maxWarnings)
  ) {
    process.exitCode = 1;
  }

  await printResults(results, { options, todoInfo, config });
}

run();
