#!/usr/bin/env node

'use strict';

let fs = require('fs');
let path = require('path');
let globby = require('globby');
let Linter = require('../lib/index');
const chalk = require('chalk');

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
  let source = fs.readFileSync(filePath, { encoding: 'utf8' });
  return linter.verify({ source, moduleId });
}

function getRelativeFilePaths() {
  let fileArgs = process.argv.slice(2).filter(arg => arg.slice(0, 2) !== '--');

  let relativeFilePaths = fileArgs
    .reduce((filePaths, fileArg) => {
      return filePaths.concat(
        globby.sync(fileArg, {
          ignore: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
          gitignore: true,
        })
      );
    }, [])
    .filter(filePath => filePath.slice(-4) === '.hbs');

  return Array.from(new Set(relativeFilePaths));
}

function checkConfigPath() {
  let configPathIndex = process.argv.indexOf('--config-path');
  let configPath = null;
  if (configPathIndex > -1) {
    configPath = process.argv[configPathIndex + 1];
  }

  return configPath;
}

function run() {
  let configPath = checkConfigPath();
  let linter;
  try {
    linter = new Linter({ configPath });
  } catch (e) {
    console.error(e.message);
    // eslint-disable-next-line no-process-exit
    return process.exit(1);
  }

  let errors = getRelativeFilePaths().reduce((errors, relativeFilePath) => {
    let filePath = path.resolve(relativeFilePath);
    let fileErrors = lintFile(linter, filePath, relativeFilePath.slice(0, -4));

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
    return errors;
  }, {});

  if (Object.keys(errors).length) {
    printErrors(errors);
  }
}

run();
