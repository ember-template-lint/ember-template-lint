#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const Linter = require('../lib/index');
const chalk = require('chalk');

const STDIN = '/dev/stdin';

function printErrors(errors, invocationOptions) {
  let { quiet, json, verbose } = invocationOptions.named;

  let errorCount = 0;
  let warningCount = 0;

  Object.keys(errors).forEach(filePath => {
    let fileErrors = errors[filePath] || [];

    let errorsFiltered = fileErrors.filter(error => error.severity === Linter.ERROR_SEVERITY);
    let warnings = quiet
      ? []
      : fileErrors.filter(error => error.severity === Linter.WARNING_SEVERITY);

    errorCount += errorsFiltered.length;
    warningCount += warnings.length;

    errors[filePath] = errorsFiltered.concat(warnings);
  });

  if (json) {
    console.log(JSON.stringify(errors, null, 2));
  } else {
    Object.keys(errors).forEach(filePath => {
      let options = {};
      let fileErrors = errors[filePath] || [];

      if (verbose) {
        options.verbose = true;
      }

      const messages = Linter.errorsToMessages(filePath, fileErrors, options);
      if (messages !== '') {
        console.log(messages);
      }
    });

    const count = errorCount + warningCount;

    if (count > 0) {
      console.log(
        chalk.red(
          chalk.bold(`✖ ${count} problems (${errorCount} errors, ${warningCount} warnings)`)
        )
      );
    }
  }
}

function lintFile(linter, filePath, moduleId) {
  let toRead = filePath === STDIN ? process.stdin.fd : filePath;

  // TODO: swap to using get-stdin when we can leverage async/await
  let source = fs.readFileSync(toRead, { encoding: 'utf8' });

  return linter.verify({ source, moduleId });
}

function expandFileGlobs(
  positional,
  globbySyncArgs = {
    ignore: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
    gitignore: true,
  }
) {
  let result = new Set();

  positional.forEach(item => {
    globby
      .sync(item, globbySyncArgs)
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
      parse(options, toProcess) {
        options.named.filename = toProcess.shift();
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
    '--no-default-ignores': {
      desc: 'Disable default ignore config',
      parse(options) {
        options.named.noDefaultIgnores = true;
      },
    },
  };

  let shouldHandleNamed = true;

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
            const helpTexts = Object.keys(optionDefinition).map(key => {
              const { params = '', desc = '' } = optionDefinition[key];

              const paramAndArgs = `  ${key} ${params}`;
              return desc
                ? paramAndArgs + ' '.repeat(30 - paramAndArgs.length) + desc
                : paramAndArgs;
            });

            console.log(['Help for ember-template-lint', ...helpTexts].join('\n'));
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

function run() {
  let options = parseArgv(process.argv.slice(2));

  let {
    named: { configPath, filename: filePathFromArgs = '', printPending, json, noDefaultIgnores },
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

  let errors = {};
  let filesToLint;
  let filesWithErrors = [];

  if (positional.length === 0 || positional.includes('-') || positional.includes(STDIN)) {
    filesToLint = new Set([STDIN]);
  } else {
    filesToLint = expandFileGlobs(positional, noDefaultIgnores ? {} : undefined);
  }

  for (let relativeFilePath of filesToLint) {
    let filePath = path.resolve(relativeFilePath);
    let fileName = relativeFilePath === STDIN ? filePathFromArgs : relativeFilePath;
    let moduleId = fileName.slice(0, -4);
    let fileErrors = lintFile(linter, filePath, moduleId);

    if (printPending) {
      let failingRules = Array.from(
        fileErrors.reduce((memo, error) => memo.add(error.rule), new Set())
      );

      if (failingRules.length > 0) {
        filesWithErrors.push({ moduleId, only: failingRules });
      }
    }

    if (
      fileErrors.some(function(err) {
        return err.severity > 1;
      })
    ) {
      process.exitCode = 1;
    }

    if (fileErrors.length) {
      errors[filePath] = fileErrors;
    }
  }

  if (printPending) {
    let pendingList = JSON.stringify(filesWithErrors, null, 2);

    if (json) {
      console.log(pendingList);
    } else {
      console.log(
        'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n'
      );

      console.log(`pending: ${pendingList}`);
    }

    return;
  }

  if (Object.keys(errors).length) {
    printErrors(errors, options);
  }
}

// exports are for easier unit testing
module.exports = {
  _parseArgv: parseArgv,
  _expandFileGlobs: expandFileGlobs,
  _printErrors: printErrors,
};

if (require.main === module) {
  run();
}
