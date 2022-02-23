import { createRequire } from 'node:module';
import path from 'node:path';

import JsonPrinter from './json.js';
import PrettyPrinter from './pretty.js';
import SarifPrinter from './sarif.js';

export function loadFormatter(options) {
  let _console = options.console || console;

  let printOptions = {
    console: _console,
    includeTodo: options.includeTodo,
    // env var is used to test output options via tests
    isInteractive: process.stdout.isTTY || process.env['IS_TTY'] === '1',
    outputFile: options.outputFile,
    quiet: options.quiet,
    updateTodo: options.updateTodo,
    verbose: options.verbose,
    workingDir: options.workingDirectory,
    hasResultData: options.hasResultData,
  };

  switch (options.format) {
    case 'json': {
      return new JsonPrinter(printOptions);
    }
    case 'pretty': {
      return new PrettyPrinter(printOptions);
    }
    case 'sarif': {
      return new SarifPrinter(printOptions);
    }
    default: {
      try {
        const CustomPrinter = createRequire(
          path.join(options.workingDirectory, '__placeholder__.js')
        )(options.format);

        return new CustomPrinter(printOptions);
      } catch (error) {
        throw new Error(
          `There was a problem loading the formatter: Could not load "${options.format}"\n${error.message}`
        );
      }
    }
  }
}
