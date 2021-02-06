const execa = require('execa');

module.exports = function run(args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || process.cwd();

  return execa(
    process.execPath,
    [require.resolve('../../bin/ember-template-lint.js'), ...args],
    options
  );
};
