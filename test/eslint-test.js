const lint = require('mocha-eslint');

const paths = [
  'bin',
  'ext',
  'lib',
  'test'
];

const options = {};
lint(paths, options);
