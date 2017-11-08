'use strict';

const lint = require('mocha-eslint');

const paths = [
  'bin',
  'ext',
  'lib',
  'test'
];

lint(paths, {
  timeout: 5000
});
