'use strict';

const Rule = require('./base');

const ERROR_MESSAGE =
  'Arguments without explicit values default to an empty string which can be confusing. Explicitly assign an empty string instead.';

module.exports = class NoValuelessArguments extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        let { name, isValueless } = node;

        if (isNamedArgument(name) && isValueless) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc.start.line,
            column: node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

function isNamedArgument(attrName) {
  return attrName.startsWith('@');
}

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
