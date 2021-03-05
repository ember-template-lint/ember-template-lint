'use strict';

const path = require('path');

class DefaultPrinter {
  constructor(options = {}) {
    this.delegates = [];
    this.console = options.console || console;

    if (options.json) {
      options.format = 'json';
    }

    switch (options.format) {
      case 'json': {
        let JsonPrinter = require('./json');
        this.delegates.push(new JsonPrinter(options));
        break;
      }
      case 'pretty': {
        let PrettyPrinter = require('./pretty');
        this.delegates.push(new PrettyPrinter(options));
        break;
      }
      default: {
        const { dir } = path.parse(options.format);

        if (dir === '.') {
          const customPrinterPath = path.resolve(options.workingDirectory, options.format);
          // eslint-disable-next-line import/no-dynamic-require
          const CustomFormatter = require(customPrinterPath);

          this.delegates.push(new CustomFormatter(options));
        } else {
          // you can also import a printer from a package "ember-template-lint-formatter-${name of package}"
          try {
            // eslint-disable-next-line import/no-dynamic-require
            const CustomPrinter = require(require.resolve(
              `ember-template-lint-formatter-${options.format}`,
              {
                paths: [options.workingDirectory],
              }
            ));

            this.delegates.push(new CustomPrinter(options));
          } catch (error) {
            this.console.error(
              `There was a problem loading the formatter: Could not load "ember-template-lint-formatter-${options.format}"`,
              error.message
            );
          }
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
