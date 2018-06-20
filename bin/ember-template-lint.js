#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Linter = require('../lib/index');
var linter = new Linter();
const chalk = require('chalk');

function printErrors(errors) {
  const quiet = process.argv.indexOf('--quiet') !== -1;

  let errorCount = 0;
  let warningCount = 0;

  Object.keys(errors).forEach(filePath => {
    let fileErrors = errors[filePath] || [];

    let errorsFiltered = fileErrors.filter(error => error.severity === Linter.ERROR_SEVERITY);
    let warnings = quiet ? [] : fileErrors.filter(error => error.severity === Linter.WARNING_SEVERITY);

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
      console.log(chalk.red(chalk.bold(`✖ ${count} problems (${errorCount} errors, ${warningCount} warnings)`)));
    }
  }
}

function lintFile(filePath, moduleId) {
  var source = fs.readFileSync(filePath, { encoding: 'utf8' });
  return linter.verify({ source: source, moduleId: moduleId });
}

function getRelativeFilePaths() {
  var fileArgs = process.argv.slice(2).filter(arg => arg.slice(0, 2) !== '--');

  var relativeFilePaths = fileArgs
    .reduce((filePaths, fileArg) => {
      var globPath;
      var isDirectory;

      try {
        isDirectory = fs.statSync(fileArg).isDirectory();
      } catch(e) {
        isDirectory = false;
      }

      globPath = fileArg;
      if (isDirectory) globPath += '/**/*.hbs';

      return filePaths.concat(glob.sync(globPath));
    }, [])
    .filter(filePath => filePath.slice(-4) === '.hbs');

  return Array.from(new Set(relativeFilePaths));
}

function run() {
  var exitCode = 0;

  var errors = getRelativeFilePaths().reduce((errors, relativeFilePath) => {
    var filePath = path.resolve(relativeFilePath);
    var fileErrors = lintFile(filePath, relativeFilePath.slice(0, -4));

    if (fileErrors.some(function(err) { return err.severity > 1; })) exitCode = 1;

    if (fileErrors.length) errors[filePath] = fileErrors;
    return errors;
  }, {});

  if (Object.keys(errors).length) printErrors(errors);
  // eslint-disable-next-line no-process-exit
  if (exitCode) return process.exit(exitCode);
}

run();
