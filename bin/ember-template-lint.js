#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Linter = require('../lib/index');
var linter = new Linter();

function printErrors(errors) {
  if (process.argv.indexOf('--json') + 1) {
    console.log(JSON.stringify(errors, null, 2));
  } else {
    Object.keys(errors).forEach(function(filePath) {
      console.log(Linter.errorsToMessages(errors[filePath]));
    });
  }
}

function lintFile(filePath, moduleId) {
  var source = fs.readFileSync(filePath, { encoding: 'utf8' });
  return linter.verify({ source: source, moduleId: moduleId });
}

function getRelativeFilePaths() {
  var fileArgs = process.argv.slice(2).filter(function(arg) {
    return arg.slice(0, 2) !== '--';
  });

  var relativeFilePaths = fileArgs
    .reduce(function(filePaths, fileArg) {
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
    .filter(function(filePath) {
      return filePath.slice(-4) === '.hbs';
    });

  return Array.from(new Set(relativeFilePaths));
}

function run() {
  var exitCode = 0;

  var errors = getRelativeFilePaths().reduce(function(errors, relativeFilePath) {
    var filePath = path.resolve(relativeFilePath);
    var fileErrors = lintFile(filePath, relativeFilePath.slice(0, -4));

    if (fileErrors.some(function(err) { return err.severity > 1; })) exitCode = 1;

    if (fileErrors.length) errors[filePath] = fileErrors;
    return errors;
  }, {});

  if (Object.keys(errors).length) printErrors(errors);
  if (exitCode) return process.exit(exitCode);
}

run();
