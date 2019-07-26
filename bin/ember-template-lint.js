#!/usr/bin/env node

'use strict';

let rw = require('rw');
let path = require('path');
let globby = require('globby');
let Linter = require('../lib/index');
let chalk = require('chalk');

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
  let source;
  try {
    source = rw.readFileSync(filePath, { encoding: 'utf8' });
  } catch (error) {
    if (error.code === 'ENXIO') {
      return [];
    } else {
      throw error;
    }
  }
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

function getRelativeFilePaths() {
  let fileArgs = process.argv.slice(2).filter(arg => arg.slice(0, 2) !== '--');
  let relativeFilePaths = fileArgs.length === 0 ? [STDIN] : expandFileGlobs(fileArgs);
  return Array.from(new Set(relativeFilePaths));
}

function getArgumentValue(flag) {
  let flagIndex = process.argv.indexOf(flag);
  let flagValue = null;
  if (flagIndex > -1) {
    flagValue = process.argv[flagIndex + 1];
  }
  return flagValue;
}

function checkConfigPath() {
  return getArgumentValue('--config-path');
}

function filePathFromArgs() {
  return getArgumentValue('--filename') || '';
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
    let fileName = relativeFilePath === STDIN ? filePathFromArgs() : relativeFilePath;
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
    return errors;
  }, {});

  if (Object.keys(errors).length) {
    printErrors(errors);
  }
}

run();
