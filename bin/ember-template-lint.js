#!/usr/bin/env node

'use strict';

// Use V8's code cache to speed up instantiation time:
require('v8-compile-cache'); // eslint-disable-line import/no-unassigned-import

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const { getTodoStorageDirPath, getTodoConfig } = require('@ember-template-lint/todo-utils');
const chalk = require('chalk');
const getStdin = require('get-stdin');
const globby = require('globby');
const isGlob = require('is-glob');
const micromatch = require('micromatch');

const Linter = require('../lib');
const processResults = require('../lib/helpers/process-results');

const readFile = promisify(fs.readFile);

const STDIN = '/dev/stdin';

function removeExt(filePath) {
  return filePath.slice(0, -path.extname(filePath).length);
}

async function buildLinterOptions(filePath, filename = '', isReadingStdin) {
  if (isReadingStdin) {
    let filePath = filename;
    let moduleId = removeExt(filePath);
    let source = await getStdin();

    return { source, filePath, moduleId };
  } else {
    let moduleId = removeExt(filePath);
    let source = await readFile(path.resolve(filePath), { encoding: 'utf8' });

    return { source, filePath, moduleId };
  }
}

function executeGlobby(workingDir, pattern, ignore) {
  // `--no-ignore-pattern` results in `ignorePattern === [false]`
  let options =
    ignore[0] === false ? { cwd: workingDir } : { cwd: workingDir, gitignore: true, ignore };

  return globby.sync(pattern, options).filter((filePath) => filePath.slice(-4) === '.hbs');
}

function isFile(possibleFile) {
  try {
    let stat = fs.statSync(possibleFile);
    return stat.isFile();
  } catch {
    return false;
  }
}

function expandFileGlobs(filePatterns, ignorePattern, glob = executeGlobby) {
  let result = new Set();
  let supportedExtensions = new Set(['.hbs', '.html', '.handlebars']);

  filePatterns.forEach((pattern) => {
    let isLiteralPath = !isGlob(pattern) && isFile(pattern);

    if (isLiteralPath) {
      let isIgnored = micromatch.isMatch(pattern, ignorePattern);

      if (!isIgnored) {
        result.add(pattern);
      }

      return;
    }

    globby
      // `--no-ignore-pattern` results in `ignorePattern === [false]`
      .sync(pattern, ignorePattern[0] === false ? {} : { ignore: ignorePattern, gitignore: true })
      .filter((filePath) => supportedExtensions.has(path.extname(filePath)))
      .forEach((filePath) => result.add(filePath));
  });

  return result;
}

function getFilesToLint(workingDir, filePatterns, ignorePattern = []) {
  let files;

  if (filePatterns.length === 0 || filePatterns.includes('-') || filePatterns.includes(STDIN)) {
    files = new Set([STDIN]);
  } else {
    files = expandFileGlobs(workingDir, filePatterns, ignorePattern);
  }

  return files;
}

function parseArgv(_argv) {
  let parser = require('yargs')
    .scriptName('ember-template-lint')
    .usage('$0 [options] [files..]')
    .options({
      'config-path': {
        describe: 'Define a custom config path',
        default: '.template-lintrc.js',
        type: 'string',
      },
      config: {
        describe:
          'Define a custom configuration to be used - (e.g. \'{ "rules": { "no-implicit-this": "error" } }\') ',
        type: 'string',
      },
      quiet: {
        describe: 'Ignore warnings and only show errors',
        boolean: true,
      },
      rule: {
        describe:
          'Specify a rule and its severity to add that rule to loaded rules - (e.g. `no-implicit-this:error` or `rule:["error", { "allow": ["some-helper"] }]`)',
        type: 'string',
      },
      filename: {
        describe: 'Used to indicate the filename to be assumed for contents from STDIN',
        type: 'string',
      },
      fix: {
        describe: 'Fix any errors that are reported as fixable',
        boolean: true,
        default: false,
      },
      json: {
        describe: 'Format output as json',
        boolean: true,
      },
      verbose: {
        describe: 'Output errors with source description',
        boolean: true,
      },
      'working-directory': {
        alias: 'cwd',
        describe: 'Path to a directory that should be considered as the current working directory.',
        type: 'string',
        // defaulting to `.` here to refer to `process.cwd()`, setting the default to `process.cwd()` itself
        // would make our snapshots unstable (and make the help output unaligned since most directory paths
        // are fairly deep)
        default: '.',
      },
      'no-config-path': {
        describe:
          'Does not use the local template-lintrc, will use a blank template-lintrc instead',
        boolean: true,
      },
      'print-pending': {
        describe:
          'Print list of formatted rules for use with `pending` in config file (deprecated)',
        boolean: true,
        hidden: true,
      },
      'update-todo': {
        describe: 'Update list of linting todos by transforming lint errors to todos',
        default: false,
        boolean: true,
      },
      'include-todo': {
        describe: 'Include todos in the results',
        default: false,
        boolean: true,
      },
      'todo-days-to-warn': {
        describe: 'Number of days after its creation date that a todo transitions into a warning',
        type: 'number',
      },
      'todo-days-to-error': {
        describe: 'Number of days after its creation date that a todo transitions into an error',
        type: 'number',
      },
      'ignore-pattern': {
        describe: 'Specify custom ignore pattern (can be disabled with --no-ignore-pattern)',
        type: 'array',
        default: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
      },
      'no-inline-config': {
        describe: 'Prevent inline configuration comments from changing config or rules',
        boolean: true,
      },
    })
    .help()
    .version();

  parser.parserConfiguration({
    'greedy-arrays': false,
  });

  if (_argv.length === 0) {
    parser.showHelp();
    parser.exit(1);
  } else {
    let options = parser.parse(_argv);

    if (options.workingDirectory === '.') {
      options.workingDirectory = process.cwd();
    }

    return options;
  }
}

const PENDING_RULES = new Set(['invalid-pending-module', 'invalid-pending-module-rule']);
function printPending(results, options) {
  let pendingList = [];
  for (let filePath in results.files) {
    let fileResults = results.files[filePath];
    let failingRules = fileResults.messages.reduce((memo, error) => {
      if (!PENDING_RULES.has(error.rule)) {
        memo.add(error.rule);
      }

      return memo;
    }, new Set());

    if (failingRules.size > 0) {
      pendingList.push({ moduleId: removeExt(filePath), only: [...failingRules] });
    }
  }
  let pendingListString = JSON.stringify(pendingList, null, 2);

  if (options.json) {
    console.log(pendingListString);
  } else {
    console.log(chalk.yellow('WARNING: Print pending is deprecated. Use --update-todo instead.\n'));

    console.log(
      'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n'
    );

    console.log(`pending: ${pendingListString}`);
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

async function run() {
  let options = parseArgv(process.argv.slice(2));
  let positional = options._;
  let config;
  let todoInfo;

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

  let linter;
  try {
    linter = new Linter({
      workingDir: options.workingDirectory,
      configPath: options.configPath,
      config,
      rule: options.rule,
      allowInlineConfig: !options.noInlineConfig,
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  if (
    linter.config.pending.length > 0 &&
    fs.existsSync(getTodoStorageDirPath(options.workingDirectory))
  ) {
    console.error(
      'Cannot use the `pending` config option in conjunction with lint todos. Please run with `--update-pending` to migrate to the new todos functionality.'
    );
    process.exitCode = 1;
    return;
  }

  if (linter.config.pending.length > 0 && options.updateTodo) {
    console.error(
      'Cannot use the `pending` config option in conjunction with `--update-todo`. Please remove the `pending` option from your config and re-run the command.'
    );
    process.exitCode = 1;
    return;
  }

  if ((options.todoDaysToWarn || options.todoDaysToError) && !options.updateTodo) {
    console.error(
      'You must use `--update-todo` when using any of `--todo-days-to-warn` or `--todo-days-to-error`.'
    );
    process.exitCode = 1;
    return;
  }

  let filePaths = getFilesToLint(options.workingDirectory, positional, options.ignorePattern);

  let resultsAccumulator = [];
  for (let relativeFilePath of filePaths) {
    let linterOptions = await buildLinterOptions(
      options.workingDirectory,
      relativeFilePath,
      options.filename,
      filePaths.has(STDIN)
    );

    let fileResults;

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
      let todoConfig = getTodoConfig(
        options.workingDirectory,
        getTodoConfigFromCommandLineOptions(options)
      );

      let [added] = await linter.updateTodo(linterOptions, fileResults, todoConfig);

      todoInfo = {
        added,
        todoConfig,
      };
    }

    if (!filePaths.has(STDIN)) {
      fileResults = await linter.processTodos(linterOptions, fileResults, options.fix);
    }

    resultsAccumulator.push(...fileResults);
  }

  let results = processResults(resultsAccumulator);

  if (results.errorCount > 0) {
    process.exitCode = 1;
  }

  if (options.printPending) {
    return printPending(results, options);
  } else {
    if (
      results.errorCount ||
      results.warningCount ||
      (options.includeTodo && results.todoCount) ||
      (options.updateTodo && todoInfo.added)
    ) {
      let Printer = require('../lib/printers/default');
      let printer = new Printer(options);
      printer.print(results, todoInfo);
    }
  }
}

// exports are for easier unit testing
module.exports = {
  _parseArgv: parseArgv,
  _expandFileGlobs: expandFileGlobs,
  _getFilesToLint: getFilesToLint,
};

if (require.main === module) {
  run();
}
