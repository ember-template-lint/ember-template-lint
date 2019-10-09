#!/usr/bin/env node

'use strict';

const rw = require('rw');
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
  let source = rw.readFileSync(filePath, { encoding: 'utf8' });
  return linter.verify({ source, moduleId });
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
  let argv = _argv.slice();
  let options = { positional: [], named: {} };

  let shouldHandleNamed = true;

  while (argv.length > 0) {
    let arg = argv.shift();

    if (arg.startsWith('--config-path')) {
      let configPath;
      if (arg === '--config-path') {
        configPath = argv.shift();
      } else if (arg.startsWith('--config-path=')) {
        configPath = arg.slice(14);
      }

      // TODO: add error handling when named args are out of order
      if (!shouldHandleNamed) {
        continue;
      }

      options.named.configPath = configPath;
    } else if (arg.startsWith('--filename')) {
      let filename;
      if (arg === '--filename') {
        filename = argv.shift();
      } else if (arg.startsWith('--filename=')) {
        filename = arg.slice(11);
      }

      // TODO: add error handling when named args are out of order
      if (!shouldHandleNamed) {
        continue;
      }

      options.named.filename = filename;
    } else if (arg === '--quiet') {
      // TODO: add error handling when named args are out of order
      if (!shouldHandleNamed) {
        continue;
      }

      options.named.quiet = true;
    } else if (arg === '--json') {
      // TODO: add error handling when named args are out of order
      if (!shouldHandleNamed) {
        continue;
      }

      options.named.json = true;
    } else if (arg === '--verbose') {
      // TODO: add error handling when named args are out of order
      if (!shouldHandleNamed) {
        continue;
      }

      options.named.verbose = true;
    } else if (arg === '--') {
      // named arguments are not allowed after `--`
      shouldHandleNamed = false;
    } else {
      options.positional.push(arg);
    }
  }
  return options;
}

function run() {
  let options = parseArgv(process.argv.slice(2));

  let {
    named: { configPath, filename: filePathFromArgs = '' },
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

  if (positional.length === 0 || positional.includes('-') || positional.includes(STDIN)) {
    filesToLint = new Set([STDIN]);
  } else {
    filesToLint = expandFileGlobs(positional);
  }

  for (let relativeFilePath of filesToLint) {
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
