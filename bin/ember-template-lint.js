#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const Linter = require('../lib/index');
const processResults = require('../lib/helpers/process-results');

const STDIN = '/dev/stdin';

function lintFile(linter, filePath, toRead, moduleId, shouldFix) {
  // TODO: swap to using get-stdin when we can leverage async/await
  let source = fs.readFileSync(toRead, { encoding: 'utf8' });
  let options = { source, filePath, moduleId };

  if (shouldFix) {
    let { isFixed, output, messages } = linter.verifyAndFix(options);
    if (isFixed) {
      fs.writeFileSync(filePath, output);
    }

    return messages;
  } else {
    return linter.verify(options);
  }
}

function expandFileGlobs(positional, ignorePattern) {
  let result = new Set();

  positional.forEach((item) => {
    globby
      // `--no-ignore-pattern` results in `ignorePattern === [false]`
      .sync(item, ignorePattern[0] === false ? {} : { ignore: ignorePattern, gitignore: true })
      .filter((filePath) => filePath.slice(-4) === '.hbs')
      .forEach((filePath) => result.add(filePath));
  });

  return result;
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
      quiet: {
        describe: 'Ignore warnings and only show errors',
        boolean: true,
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
      },
      verbose: {
        describe: 'Output errors with source description',
        boolean: true,
      },
      'print-pending': {
        describe: 'Print list of formated rules for use with `pending` in config file',
        boolean: true,
      },
      'ignore-pattern': {
        describe: 'Specify custom ignore pattern (can be disabled with --no-ignore-pattern)',
        type: 'array',
        default: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
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
    return options;
  }
}

const PENDING_RULES = ['invalid-pending-module', 'invalid-pending-module-rule'];
function printPending(results, options) {
  let pendingList = [];
  for (let filePath in results.files) {
    let fileResults = results.files[filePath];
    let failingRules = fileResults.messages.reduce((memo, error) => {
      if (!PENDING_RULES.includes(error.rule)) {
        memo.add(error.rule);
      }

      return memo;
    }, new Set());

    if (failingRules.size > 0) {
      pendingList.push({ moduleId: filePath.slice(0, -4), only: Array.from(failingRules) });
    }
  }
  let pendingListString = JSON.stringify(pendingList, null, 2);

  if (options.json) {
    console.log(pendingListString);
  } else {
    console.log(
      'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n'
    );

    console.log(`pending: ${pendingListString}`);
  }
}

function run() {
  let options = parseArgv(process.argv.slice(2));
  let positional = options._;

  let linter;
  try {
    linter = new Linter({ configPath: options.configPath });
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    return;
  }

  let filesToLint;
  if (positional.length === 0 || positional.includes('-') || positional.includes(STDIN)) {
    filesToLint = new Set([STDIN]);
  } else {
    filesToLint = expandFileGlobs(positional, options.ignorePattern);
  }

  let resultsAccumulator = [];
  for (let relativeFilePath of filesToLint) {
    let resolvedFilePath = path.resolve(relativeFilePath);
    let toRead = resolvedFilePath === STDIN ? process.stdin.fd : resolvedFilePath;
    let filePath = resolvedFilePath === STDIN ? options.filename || '' : relativeFilePath;
    let moduleId = filePath.slice(0, -4);
    let messages = lintFile(linter, filePath, toRead, moduleId, options.fix);

    resultsAccumulator.push(...messages);
  }

  let results = processResults(resultsAccumulator);
  if (results.errorCount > 0) {
    process.exitCode = 1;
  }

  if (options.printPending) {
    return printPending(results, options);
  } else {
    if (results.errorCount || results.warningCount) {
      let Printer = require('../lib/printers/default');
      let printer = new Printer(options);
      printer.print(results);
    }
  }
}

// exports are for easier unit testing
module.exports = {
  _parseArgv: parseArgv,
  _expandFileGlobs: expandFileGlobs,
};

if (require.main === module) {
  run();
}
