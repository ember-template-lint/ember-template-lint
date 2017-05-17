'use strict';

const lint = require('mocha-eslint');

const paths = [
  'ext/**/*.js',
  'node-tests/**/*.js',
  'broccoli-template-linter.js',
  'index.js'
];

lint(paths);
