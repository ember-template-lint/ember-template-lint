'use strict';

var lint = require('mocha-eslint');

var paths = [
  'ext/**/*.js',
  'node-tests/**/*.js',
  'broccoli-template-linter.js',
  'index.js'
];

lint(paths);
