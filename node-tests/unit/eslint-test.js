'use strict';

var lint = require('mocha-eslint');

var paths = [
  'ext/**/*.js',
  'node-tests/**/*.js'
];

lint(paths);
