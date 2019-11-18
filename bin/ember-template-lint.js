#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const Linter = require('../lib/index');

const STDIN = '/dev/stdin';

function lintFile(linter, filePath, moduleId, shouldFix) {
  let toRead = filePath === STDIN ? process.stdin.fd : filePath;

  // TODO: swap to using get-stdin when we can leverage async/await
  let source = fs.readFileSync(toRead, { encoding: 'utf8' });

  let result = linter.verifyAndFix({ source, moduleId, shouldFix });
  return result.messages;
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

  let shouldHandleNamed = true;

  while (toProcess.length > 0) {
    let arg = toProcess.shift();

    if (!shouldHandleNamed) {
      options.positional.push(arg);
    } else {
      switch (arg) {
        case '--config-path':
          options.named.configPath = toProcess.shift();
          break;
        case '--filename':
          options.named.filename = toProcess.shift();
          break;
        case '--fix':
          options.named.fix = true;
          break;
        case '--quiet':
          options.named.quiet = true;
          break;
        case '--json':
          options.named.json = true;
          break;
        case '--verbose':
          options.named.verbose = true;
          break;
        case '--print-pending':
          options.named.printPending = true;
          break;
        case '--':
          shouldHandleNamed = false;
          break;
        default:
          if (arg.startsWith('--config-path=') || arg.startsWith('--filename=')) {
            toProcess.unshift(...arg.split('=', 2));
          } else {
            options.positional.push(arg);
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
    let filePath = path.resolve(relativeFilePath);
    let fileName = relativeFilePath === STDIN ? filePathFromArgs : relativeFilePath;
    let moduleId = fileName.slice(0, -4);
    let fileErrors = lintFile(linter, filePath, moduleId, fix);

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
