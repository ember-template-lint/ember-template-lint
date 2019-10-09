#!/usr/bin/env node

'use strict';

const rw = require('rw');
const path = require('path');
const globby = require('globby');
const Linter = require('../lib/index');
const chalk = require('chalk');

const STDIN = '/dev/stdin';

function printErrors(errors) {
  const quiet = process.argv.indexOf('--quiet') !== -1;

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

  if (process.argv.indexOf('--json') + 1) {
    console.log(JSON.stringify(errors, null, 2));
  } else {
    Object.keys(errors).forEach(filePath => {
      let options = {};
      let fileErrors = errors[filePath] || [];

      if (process.argv.indexOf('--verbose') + 1) {
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
  let source = rw.readFileSync(filePath, { encoding: 'utf8' });
  return linter.verify({ source, moduleId });
}

function expandFileGlobs(fileArgs) {
  return fileArgs.reduce((filePaths, fileArg) => {
    let files;
    if (['-', STDIN].includes(fileArg)) {
      if (filePaths.includes(STDIN)) {
        return filePaths;
      }
      files = [STDIN];
    } else {
      files = globby
        .sync(fileArg, {
          ignore: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
          gitignore: true,
        })
        .filter(filePath => filePath.slice(-4) === '.hbs');
    }
    return filePaths.concat(files);
  }, []);
}

function parseArgv(argv) {
  let arg;
  let options = { positional: [], named: {} };
  argvConsumption: while ((arg = argv.shift())) {
    switch (arg) {
      case '--config-path':
        options.named.configPath = argv.shift();
        break;
      case '--filename':
        options.named.filename = argv.shift();
        break;
      case '--':
        options.positional = [...options.positional, ...argv];
        break argvConsumption;
      default:
        options.positional.push(arg);
    }
  }
  return options;
}

function run() {
  let {
    named: { configPath, filename: filePathFromArgs = '' },
    positional: fileArgs,
  } = parseArgv(process.argv.slice(2));

  let linter;
  try {
    linter = new Linter({ configPath });
  } catch (e) {
    console.error(e.message);
    return process.exit(1); // eslint-disable-line no-process-exit
  }

  let errors = {};
  let relativeFilePaths = fileArgs.length === 0 ? [STDIN] : expandFileGlobs(fileArgs);

  for (let relativeFilePath of new Set(relativeFilePaths)) {
    let filePath = path.resolve(relativeFilePath);
    let fileName = relativeFilePath === STDIN ? filePathFromArgs : relativeFilePath;
    let fileErrors = lintFile(linter, filePath, fileName.slice(0, -4));

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

  if (Object.keys(errors).length) {
    printErrors(errors);
  }
}

run();
