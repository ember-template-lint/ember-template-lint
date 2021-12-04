import execa from 'execa';

export default function run(args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || process.cwd();

  return execa(
    process.execPath,
    [new URL('../../bin/ember-template-lint.js', import.meta.url).pathname, ...args],
    options
  );
}
