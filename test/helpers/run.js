const execa = require('execa');

let project;

function setProject(_project = undefined) {
  project = _project;
}

function run(args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || project.path('.');

  return execa(
    process.execPath,
    [require.resolve('../../bin/ember-template-lint.js'), ...args],
    options
  );
}

module.exports = { setProject, run };
