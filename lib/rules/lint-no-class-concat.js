'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const ERROR_MESSAGE = 'Please do not concat class names';

module.exports = class NoClassConcat extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let className = AstNodeInfo.findAttribute(node, 'class');
        if (
          className &&
          (AstNodeInfo.isConcatStatement(className.value) ||
            (AstNodeInfo.isMustacheStatement(className.value) &&
              isConcatHelper(className.value.path)))
        ) {
          this.log({
            message: ERROR_MESSAGE,
            line: className.loc && className.loc.start.line,
            column: className.loc && className.loc.start.column,
            source: this.sourceForNode(className),
          });
        }
      },
    };
  }
};

function isConcatHelper(node) {
  return node && AstNodeInfo.isPathExpression(node) && node.original === 'concat';
}

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
