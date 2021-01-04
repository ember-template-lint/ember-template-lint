const getPackageJson = require('./get-package-json');

module.exports = function getDaysToDecay(options, pkg = getPackageJson()) {
  const todoDaysToWarn = options.todoDaysToWarn;
  const todoDaysToError = options.todoDaysToError;
  let daysToDecay = {};

  if (todoDaysToWarn) {
    daysToDecay.warn = todoDaysToWarn;
  }

  if (todoDaysToError) {
    daysToDecay.error = todoDaysToError;
  }

  if (Object.keys(daysToDecay).length > 0) {
    return daysToDecay;
  }

  if (typeof pkg.lintTodo === 'undefined') {
    return;
  }

  daysToDecay = pkg.lintTodo.daysToDecay;

  if (
    typeof daysToDecay.warn === 'number' &&
    typeof daysToDecay.error === 'number' &&
    daysToDecay.warn > daysToDecay.error
  ) {
    throw new Error(
      'The `lintTodo` configuration in the package.json contains invalid values. The `warn` value must be less than the `error` value.'
    );
  }

  return daysToDecay;
};
