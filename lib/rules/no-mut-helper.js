'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

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
          `    * \`setterAlternative\` -- (Optional) If the app defines or depends on a \`{{set}}\` helper,
                    this rule error message could suggest using that helper as a way to resolve the violation.
                    If this config is not defined, the error message will default to only suggesting a JS action.`,
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

      SubExpression(node) {
        this._checkForMutHelper(node);
      },
    };
  }

  _checkForMutHelper(node) {
    if (node.path.type === 'PathExpression' && node.path.original === 'mut') {
      if (this.config.setterAlternative) {
        this.log({
          message: generateMessageWithAlternative(this.config.setterAlternative),
          node,
        });
      } else {
        this.log({
          message,
          node,
        });
      }
    }
  }
};

module.exports.message = message;
module.exports.generateMessageWithAlternative = generateMessageWithAlternative;
