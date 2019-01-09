#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var globby = require('globby');
var Linter = require('../lib/index');
const chalk = require('chalk');

let [templatePatterns, args] = process.argv.slice(2).reduce(function([files, options], arg) {
  if (options.length || (arg.slice(0, 2) === '--')) {
    options = options.concat(arg);
  } else {
    files = files.concat(arg);
  }
  return [files, options];
}, [[], []]);

function printErrors(errors) {
  const quiet = args.indexOf('--quiet') !== -1;

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

  if (args.indexOf('--json') + 1) {
    console.log(JSON.stringify(errors, null, 2));
  } else {
    Object.keys(errors).forEach(filePath => {
      let options = {};
      let fileErrors = errors[filePath] || [];

      if (args.indexOf('--verbose') + 1) {
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
  var source = fs.readFileSync(filePath, { encoding: 'utf8' });
  return linter.verify({ source: source, moduleId: moduleId });
}

function getRelativeFilePaths() {
  var fileArgs = templatePatterns;

  var relativeFilePaths = fileArgs
    .reduce((filePaths, fileArg) => {
      return filePaths.concat(globby.sync(fileArg, { gitignore: true }));
    }, [])
    .filter(filePath => filePath.slice(-4) === '.hbs');

  return Array.from(new Set(relativeFilePaths));
}

function checkConfigPath() {
  var configPathIndex = args.indexOf('--config-path');
  var configPath = null;
  if (configPathIndex > -1) {
    var configPathValue = args[configPathIndex + 1];
    configPath = path.join(process.cwd(), configPathValue);
  }

  return configPath;
}

function run() {
  var exitCode = 0;

  var configPath = checkConfigPath();
  var linter;
  try {
    linter = new Linter({ configPath });
  } catch (e) {
    console.error(e.message);
    // eslint-disable-next-line no-process-exit
    return process.exit(1);
  }

  var errors = getRelativeFilePaths().reduce((errors, relativeFilePath) => {
    var filePath = path.resolve(relativeFilePath);
    var fileErrors = lintFile(linter, filePath, relativeFilePath.slice(0, -4));

    if (
      fileErrors.some(function(err) {
        return err.severity > 1;
      })
    )
      exitCode = 1;

    if (fileErrors.length) errors[filePath] = fileErrors;
    return errors;
  }, {});

  if (Object.keys(errors).length) printErrors(errors);
  // eslint-disable-next-line no-process-exit
  if (exitCode) return process.exit(exitCode);
}

run();
