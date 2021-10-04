'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE =
  'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.';

module.exports = class NoExtraMutHelperArgument extends Rule {
  visitor() {
    return {
      SubExpression(node) {
        if (node.path.original !== 'mut') {
          return;
        }

        if (node.params.length === 1) {
          // Correct usage.
          return;
        }

        this.log({
          message: ERROR_MESSAGE,
          node,
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
