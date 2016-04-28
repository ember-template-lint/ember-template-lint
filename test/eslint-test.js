var lint = require('mocha-eslint');

var paths = [
  'bin',
  'ext',
  'lib',
  'test'
];

var options = {};
lint(paths, options);
