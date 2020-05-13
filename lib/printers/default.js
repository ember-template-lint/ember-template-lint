'use strict';

const path = require('path');

class DefaultPrinter {
  constructor(options = {}) {
    this.delegates = [];

    if (options.json) {
      options.formatter = 'json';
    }

    switch (options.formatter) {
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
        const { dir } = path.parse(options.formatter);

        // printers can be relative to the current working directory is come from an npm package
        if (dir === '.') {
          const customPrinterPath = path.resolve(process.cwd(), options.formatter);
          // eslint-disable-next-line import/no-dynamic-require
          const CustomPrinter = require(customPrinterPath);

          this.delegates.push(new CustomPrinter(options));
        } else {
          // you can also import a printer from a package "ember-template-lint-printer-${name of package}"
          try {
            // eslint-disable-next-line import/no-dynamic-require
            const CustomPrinter = require(`ember-template-lint-printer-${options.formatter}`);

            this.delegates.push(new CustomPrinter(options));
          } catch (ex) {
            (options.console || console).error(
              `There was a problem loading the printer: Could not load "ember-template-lint-printer-${options.formatter}"`,
              ex.message
            );
          }
        }
        break;
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
