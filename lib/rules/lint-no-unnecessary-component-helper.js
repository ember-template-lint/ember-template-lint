'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Invoke component directly instead of using `component` helper';

module.exports = class NoUnnecessaryComponentHelper extends Rule {
  visitor() {
    function isComponentHelper(node) {
      return (
        node &&
        node.path &&
        AstNodeInfo.isPathExpression(node.path) &&
        node.path.original === 'component' &&
        node.params.length > 0
      );
    }

    const allowedUsages = new Set();
    function recordAngleBracketArguments(node) {
      node.attributes
        .filter(attribute => attribute.name.startsWith('@') && isComponentHelper(attribute.value))
        .forEach(attribute => allowedUsages.add(attribute.value));
    }

    function checkNode(node) {
      if (
        isComponentHelper(node) &&
        AstNodeInfo.isStringLiteral(node.params[0]) &&
        !node.params[0].value.includes('@') &&
        !allowedUsages.has(node)
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
      ElementNode: recordAngleBracketArguments,
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
