'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./base');

const message =
  'Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.';
function generateMessageWithAlternative(setAlternative) {
  return `Unexpected usage of mut helper. If using mut as a setter, consider using a JS action or ${setAlternative} instead.`;
}

module.exports = class NoMutHelper extends Rule {
  parseConfig(config) {
    if (!config || !config.setterAlternative) {
      return {};
    } else if (typeof config.setterAlternative !== 'string') {
      let errorMessage = createErrorMessage(
        this.ruleName,
        [
          '  * object -- An object with the following key:',
          '    * `setterAlternative` -- String name of a helper that could replace mut as a setter',
        ],
        config
      );

      throw new Error(errorMessage);
    } else {
      return config;
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForMutHelper(node);
      },

      BlockStatement(node) {
        this._checkForMutHelper(node);
      },

      SubExpression(node) {
        this._checkForMutHelper(node);
      },
    };
  }

  _checkForMutHelper(node) {
    if (node.path.original === 'mut') {
      if (this.config.setterAlternative) {
        this.log({
          message: generateMessageWithAlternative(this.config.setterAlternative),
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      } else {
        this.log({
          message,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      }
    }
  }
};

module.exports.message = message;
module.exports.generateMessageWithAlternative = generateMessageWithAlternative;
