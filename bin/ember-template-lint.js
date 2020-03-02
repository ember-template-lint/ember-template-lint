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

function expandFileGlobs(positional) {
  let result = new Set();

  positional.forEach(item => {
    globby
      .sync(item, {
        ignore: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
        gitignore: true,
      })
      .filter(filePath => filePath.slice(-4) === '.hbs')
      .forEach(filePath => result.add(filePath));
  });

  return result;
}

function parseArgv(_argv) {
  let toProcess = _argv.slice();
  let options = { positional: [], named: {} };

  const optionDefinition = {
    '--config-path': {
      params: '<config_path>',
      desc: 'Define a custom config path',
      parse(options, toProcess) {
        options.named.configPath = toProcess.shift();
      },
    },
    '--quiet': {
      desc: 'Ignore warnings and only show errors',
      parse(options) {
        options.named.quiet = true;
      },
    },
    '--filename': {
      desc: 'Used to indicate the filename to be assumed for contents from STDIN',
      parse(options, toProcess) {
        options.named.filename = toProcess.shift();
      },
    },
    '--fix': {
      desc: 'Fix any errors that are reported as fixable',
      parse(options) {
        options.named.fix = true;
      },
    },
    '--json': {
      desc: 'Format output as json',
      parse(options) {
        options.named.json = true;
      },
    },
    '--verbose': {
      desc: 'Output errors with source description',
      parse(options) {
        options.named.verbose = true;
      },
    },
    '--print-pending': {
      desc: 'Print list of formated rules for use with `pending` in config file',
      parse(options) {
        options.named.printPending = true;
      },
    },
  };

  let shouldHandleNamed = true;

  const helpTexts = Object.keys(optionDefinition).map(key => {
    const { params = '', desc = '' } = optionDefinition[key];

    const paramAndArgs = `  ${key} ${params}`;
    return desc ? paramAndArgs + ' '.repeat(30 - paramAndArgs.length) + desc : paramAndArgs;
  });
  const helpOutput = ['Usage for ember-template-lint:', ...helpTexts].join('\n');

  if (toProcess.length === 0) {
    console.log(helpOutput);
    /* eslint-disable-next-line no-process-exit */
    process.exit(1);
  }

  while (toProcess.length > 0) {
    let arg = toProcess.shift();

    if (!shouldHandleNamed) {
      options.positional.push(arg);
    } else {
      if (optionDefinition[arg]) {
        optionDefinition[arg].parse(options, toProcess);
      } else {
        switch (arg) {
          case '--help': {
            console.log(helpOutput);
            /* eslint-disable-next-line no-process-exit */
            process.exit(0);
          }
          case '--': {
            shouldHandleNamed = false;
            break;
          }
          default: {
            if (arg.startsWith('--config-path=') || arg.startsWith('--filename=')) {
              toProcess.unshift(...arg.split('=', 2));
            } else {
              options.positional.push(arg);
            }
          }
        }
      }
    }
  }

  return options;
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

  if (options.named.json) {
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

  let {
    named: { configPath, filename: filePathFromArgs = '', fix },
    positional,
  } = options;

  let linter;
  try {
    linter = new Linter({ configPath });
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    return;
  }

  let filesToLint;
  if (positional.length === 0 || positional.includes('-') || positional.includes(STDIN)) {
    filesToLint = new Set([STDIN]);
  } else {
    filesToLint = expandFileGlobs(positional);
  }

  let resultsAccumulator = [];
  for (let relativeFilePath of filesToLint) {
    let resolvedFilePath = path.resolve(relativeFilePath);
    let toRead = resolvedFilePath === STDIN ? process.stdin.fd : resolvedFilePath;
    let filePath = resolvedFilePath === STDIN ? filePathFromArgs : relativeFilePath;
    let moduleId = filePath.slice(0, -4);
    let messages = lintFile(linter, filePath, toRead, moduleId, fix);

    resultsAccumulator.push(...messages);
  }

  let results = processResults(resultsAccumulator);
  if (results.errorCount > 0) {
    process.exitCode = 1;
  }

  if (options.named.printPending) {
    return printPending(results, options);
  } else {
    if (results.errorCount || results.warningCount) {
      let Printer = require('../lib/printers/default');
      let printer = new Printer(options.named);
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
