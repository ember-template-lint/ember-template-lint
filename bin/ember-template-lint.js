#!/usr/bin/env node

'use strict';

// Use V8's code cache to speed up instantiation time:
require('v8-compile-cache'); // eslint-disable-line import/no-unassigned-import

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const getStdin = require('get-stdin');
const globby = require('globby');
const isValidGlob = require('is-valid-glob');
const micromatch = require('micromatch');

const Linter = require('../lib');
const processResults = require('../lib/helpers/process-results');

const readFile = promisify(fs.readFile);

const STDIN = '/dev/stdin';

async function buildLinterOptions(filePath, filename = '', isReadingStdin) {
  if (isReadingStdin) {
    let filePath = filename;
    let moduleId = filePath.slice(0, -4);
    let source = await getStdin();

    return { source, filePath, moduleId };
  } else {
    let moduleId = filePath.slice(0, -4);
    let source = await readFile(path.resolve(filePath), { encoding: 'utf8' });

    return { source, filePath, moduleId };
  }
}

function lintSource(linter, options, shouldFix) {
  if (shouldFix) {
    let { isFixed, output, messages } = linter.verifyAndFix(options);
    if (isFixed) {
      fs.writeFileSync(options.filePath, output);
    }

    return messages;
  } else {
    return linter.verify(options);
  }
}

function expandFileGlobs(filePatterns, ignorePattern) {
  let result = new Set();

  filePatterns.forEach((pattern) => {
    let isHBS = pattern.slice(-4) === '.hbs';
    let isLiteralPath = !isValidGlob(pattern) && fs.existsSync(pattern);

    if (isHBS && isLiteralPath) {
      let isIgnored = !micromatch.isMatch(pattern, ignorePattern);

      if (!isIgnored) {
        result.add(pattern);
      }

      return;
    }

    globby
      // `--no-ignore-pattern` results in `ignorePattern === [false]`
      .sync(pattern, ignorePattern[0] === false ? {} : { ignore: ignorePattern, gitignore: true })
      .filter((filePath) => filePath.slice(-4) === '.hbs')
      .forEach((filePath) => result.add(filePath));
  });

  return result;
}

function getFilesToLint(filePatterns, ignorePattern = []) {
  let files;

  if (filePatterns.length === 0 || filePatterns.includes('-') || filePatterns.includes(STDIN)) {
    files = new Set([STDIN]);
  } else {
    files = expandFileGlobs(filePatterns, ignorePattern);
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
      'no-config-path': {
        describe:
          'Does not use the local template-lintrc, will use a blank template-lintrc instead',
        boolean: true,
      },
      'print-pending': {
        describe: 'Print list of formatted rules for use with `pending` in config file',
        boolean: true,
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
      pendingList.push({ moduleId: filePath.slice(0, -4), only: [...failingRules] });
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

async function run() {
  let options = parseArgv(process.argv.slice(2));
  let positional = options._;
  let config;

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

  let filePaths = getFilesToLint(positional, options.ignorePattern);

  let resultsAccumulator = [];
  for (let relativeFilePath of filePaths) {
    let linterOptions = await buildLinterOptions(
      relativeFilePath,
      options.filename,
      filePaths.has(STDIN)
    );

    let messages = lintSource(linter, linterOptions, options.fix);

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
  _getFilesToLint: getFilesToLint,
};

if (require.main === module) {
  run();
}
