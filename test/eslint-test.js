var lint = require('mocha-eslint');

var paths = [
  'bin',
  'lib',
  'test'
];

var options = {};
lint(paths, options);
