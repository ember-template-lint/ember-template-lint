'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = 'Invoke component directly instead of using `component` helper';

module.exports = class NoUnnecessaryComponentHelper extends Rule {
  visitor() {
    let inSafeNamespace = false;
    const markAsSafeNamespace = {
      enter() {
        inSafeNamespace = true;
      },
      exit() {
        inSafeNamespace = false;
      },
    };

    function isComponentHelper(node) {
      return (
        node.path.type === 'PathExpression' &&
        node.path.original === 'component' &&
        node.params.length > 0
      );
    }

    function checkNode(node) {
      if (
        isComponentHelper(node) &&
        node.params[0].type === 'StringLiteral' &&
        !node.params[0].value.includes('@') &&
        !inSafeNamespace
      ) {
        this.log({
          message: ERROR_MESSAGE,
          node,
        });
      }
    }

    return {
      AttrNode: markAsSafeNamespace,
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
