import { execa } from 'execa';
import { fileURLToPath } from 'node:url';

export default function run(args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || process.cwd();

  return execa(
    process.execPath,
    [fileURLToPath(new URL('../../bin/ember-template-lint.js', import.meta.url)), ...args],
    options
  );
}
