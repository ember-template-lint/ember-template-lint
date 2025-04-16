import { createRequire } from 'node:module';
import path from 'node:path';

import JsonFormatter from './json.js';
import KakouneFormatter from './kakoune.js';
// The following disable should be safe. This particular rule does not need to identify
// cycles that are broken when using dynamic imports. See https://github.com/import-js/eslint-plugin-import/issues/2265
// eslint-disable-next-line import/no-cycle
import MultiFormatter from './multi.js';
import PrettyFormatter from './pretty.js';
import SarifFormatter from './sarif.js';

export function loadFormatter(options) {
  let formatOptions = {
    includeTodo: options.includeTodo,
    // env var is used to test output options via tests
    isInteractive: process.stdout.isTTY || process.env['IS_TTY'] === '1',
    outputFile: options.outputFile,
    quiet: options.quiet,
    updateTodo: options.updateTodo,
    verbose: options.verbose,
    hasResultData: options.hasResultData,
    config: options.config,
    workingDirectory: options.workingDirectory,
    // backwards compatibility with old-style formatters
    console: options.console || console,
  };

  switch (options.format) {
    case 'json': {
      return new JsonFormatter(formatOptions);
    }
    case 'pretty': {
      return new PrettyFormatter(formatOptions);
    }
    case 'sarif': {
      return new SarifFormatter(formatOptions);
    }
    case 'multi': {
      return new MultiFormatter(formatOptions);
    }
    case 'kakoune': {
      return new KakouneFormatter(formatOptions);
    }
    default: {
      try {
        const CustomFormatter = createRequire(
          path.join(options.workingDirectory, '__placeholder__.js')
        )(options.format);

        return new CustomFormatter(formatOptions);
      } catch (error) {
        throw new Error(
          `There was a problem loading the formatter: Could not load "${options.format}"\n${error.message}`
        );
      }
    }
  }
}
