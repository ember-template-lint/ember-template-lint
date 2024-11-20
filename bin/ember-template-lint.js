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

import { parseArgv, getFilesToLint } from '../lib/helpers/cli.js';
import printResults from '../lib/helpers/print-results.js';
import processResults from '../lib/helpers/process-results.js';
import Linter from '../lib/linter.js';

const readFile = promisify(fs.readFile);

const STDIN = '/dev/stdin';

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

async function run() {
  let options = parseArgv(process.argv.slice(2));
  let positional = options._;
  let config;
  let isOverridingConfig = _isOverridingConfig(options);
  let shouldWriteToStdout = !(
    options.quiet ||
    (options.outputFile && ['sarif', 'json'].includes(options.format))
  );
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
      console: _console,
    });
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
    filePaths = getFilesToLint(
      options.workingDirectory,
      positional,
      options.ignorePattern,
      options.errorOnUnmatchedPattern !== false
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

  let resultsAccumulator = [];
  for (let relativeFilePath of filePaths) {
    let linterOptions = await buildLinterOptions(
      options.workingDirectory,
      relativeFilePath,
      options.filename,
      filePaths.has(STDIN)
    );

    let fileResults;

    if (options.printConfig) {
      let fileConfig = await linter.getConfigForFile(linterOptions);

      _console.log(JSON.stringify(fileConfig, null, 2));
      process.exitCode = 0;
      return;
    }

    if (options.fix) {
      let { isFixed, output, messages } = await linter.verifyAndFix(linterOptions);
      if (isFixed) {
        fs.writeFileSync(linterOptions.filePath, output, { encoding: 'utf-8' });
      }
      fileResults = messages;
    } else {
      fileResults = await linter.verify(linterOptions);
    }

    if (options.updateTodo) {
      let { addedCount, removedCount } = linter.updateTodo(
        linterOptions,
        fileResults,
        todoInfo.todoConfig,
        isOverridingConfig
      );

      todoInfo.added += addedCount;
      todoInfo.removed += removedCount;
    }

    if (!filePaths.has(STDIN)) {
      fileResults = linter.processTodos(
        linterOptions,
        fileResults,
        todoInfo.todoConfig,
        options.fix || options.cleanTodo,
        isOverridingConfig
      );
    }

    resultsAccumulator.push(...fileResults);
  }

  let results = processResults(resultsAccumulator);

  if (
    results.errorCount > 0 ||
    (!options.quiet && options.maxWarnings && results.warningCount > options.maxWarnings)
  ) {
    process.exitCode = 1;
  }

  await printResults(results, { options, todoInfo, config: linter.config });
}

run();
