'use strict';

const Module = require('module');
const path = require('path');

// eslint-disable-next-line node/no-unsupported-features/node-builtins, node/no-deprecated-api
const createRequire = Module.createRequire || Module.createRequireFromPath;

class DefaultPrinter {
  constructor(options = {}) {
    this.delegates = [];
    this.console = options.console || console;

    let printOptions = {
      console: this.console,
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

    const format = options.json ? 'json' : options.format;

    switch (format) {
      case 'json': {
        let JsonPrinter = require('./json');
        this.delegates.push(new JsonPrinter(printOptions));
        break;
      }
      case 'pretty': {
        let PrettyPrinter = require('./pretty');
        this.delegates.push(new PrettyPrinter(printOptions));
        break;
      }
      case 'sarif': {
        let SarifPrinter = require('./sarif');
        this.delegates.push(new SarifPrinter(printOptions));
        break;
      }
      default: {
        try {
          const CustomPrinter = createRequire(
            path.join(options.workingDirectory, '__placeholder__.js')
          )(options.format);

          this.delegates.push(new CustomPrinter(printOptions));
        } catch (error) {
          throw new Error(
            `There was a problem loading the formatter: Could not load "${options.format}"\n${error.message}`
          );
        }
      }
    }
  }

  print(results, todoInfo) {
    for (let delegate of this.delegates) {
      delegate.print(results, todoInfo);
    }
  }
}

module.exports = DefaultPrinter;
