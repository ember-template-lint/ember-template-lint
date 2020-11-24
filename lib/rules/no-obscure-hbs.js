'use strict';

const Rule = require('./base');

function ERROR_MESSAGE(expression) {
  return `Obscure expressions are prohibited. ${expression}. Please use Ember's getter instead. i.e {{get list '0'}} `;
}

module.exports = class NoObscureHbs extends Rule {
  visitor() {
    return {
      PathExpression(node) {
        // Regex test for any word character plus digit. i.e.  "test.1"
        let regex = /\w+.\d/;
        if (node.original && node.original.match(regex)) {
          this.log({
            message: ERROR_MESSAGE(node.original),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: `${node.original}`,
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
