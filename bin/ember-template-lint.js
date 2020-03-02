#!/usr/bin/env node

'use strict';

const stripBom = require('strip-bom');
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const Linter = require('../lib/index');

const STDIN = '/dev/stdin';

function isFixed(source, output) {
  return stripBom(source) !== output;
}

function lintFile(linter, filePath, toRead, moduleId, shouldFix) {
  // TODO: swap to using get-stdin when we can leverage async/await
  let source = fs.readFileSync(toRead, { encoding: 'utf8' });
  let options = { source, filePath, moduleId };

  if (shouldFix) {
    let { output, messages } = linter.verifyAndFix(options);
    if (isFixed(source, output)) {
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

function run() {
  let options = parseArgv(process.argv.slice(2));

  let {
    named: { configPath, filename: filePathFromArgs = '', fix, printPending, json },
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
    filesToLint = expandFileGlobs(positional);
  }

  for (let relativeFilePath of filesToLint) {
    let resolvedFilePath = path.resolve(relativeFilePath);
    let toRead = resolvedFilePath === STDIN ? process.stdin.fd : resolvedFilePath;
    let filePath = resolvedFilePath === STDIN ? filePathFromArgs : relativeFilePath;
    let moduleId = filePath.slice(0, -4);
    let fileErrors = lintFile(linter, filePath, toRead, moduleId, fix);

    if (printPending) {
      const ignoredPendingRules = ['invalid-pending-module', 'invalid-pending-module-rule'];
      let failingRules = Array.from(
        fileErrors.reduce((memo, error) => {
          if (!ignoredPendingRules.includes(error.rule)) {
            memo.add(error.rule);
          }

          return memo;
        }, new Set())
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
      errors[resolvedFilePath] = fileErrors;
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
    let Printer = require('../lib/printers/default');
    let printer = new Printer(options.named);
    printer.print(errors);
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
