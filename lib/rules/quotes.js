'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

module.exports = class Quotes extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        if (!config) {
          return false;
        }
        break;
      case 'string':
        if (['double', 'single'].includes(config)) {
          return config;
        }
        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * "double" - requires the use of double quotes wherever possible',
        '  * "single" - requires the use of single quotes wherever possible',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    let badChar;
    let goodChar;
    let message;
    switch (this.config) {
      case 'double':
        badChar = "'";
        goodChar = '"';
        message = 'you must use double quotes in templates';
        break;
      case 'single':
        badChar = '"';
        goodChar = "'";
        message = 'you must use single quotes in templates';
        break;
    }

    return {
      AttrNode(node) {
        if (!node.isValueless && node.quoteType === badChar) {
          if (this.mode === 'fix') {
            node.quoteType = goodChar;
          } else {
            return this.log({
              message,
              node,
              isFixable: true,
            });
          }
        }
      },

      StringLiteral(node, path) {
        let errorSource = this.sourceForNode(path.parentNode);

        if (node.quoteType === badChar) {
          if (this.mode === 'fix') {
            node.quoteType = goodChar;
          } else {
            return this.log({
              message,
              node,
              source: errorSource,
              isFixable: true,
            });
          }
        }
      },
    };
  }
};
