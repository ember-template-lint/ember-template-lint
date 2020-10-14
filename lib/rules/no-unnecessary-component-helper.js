'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

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
        AstNodeInfo.isPathExpression(node.path) &&
        node.path.original === 'component' &&
        node.params.length > 0
      );
    }

    function checkNode(node) {
      if (
        isComponentHelper(node) &&
        AstNodeInfo.isStringLiteral(node.params[0]) &&
        !node.params[0].value.includes('@') &&
        !inSafeNamespace
      ) {
        this.log({
          message: ERROR_MESSAGE,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
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
