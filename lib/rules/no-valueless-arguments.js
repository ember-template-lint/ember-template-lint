'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = 'Named arguments should have an explicitly assigned value.';

module.exports = class NoValuelessArguments extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        let { name, isValueless } = node;

        if (isNamedArgument(name) && isValueless) {
          this.log({
            message: ERROR_MESSAGE,
            node,
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
