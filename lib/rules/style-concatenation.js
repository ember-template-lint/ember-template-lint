'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const ERROR_MESSAGE = 'Concatenated styles must be marked as `htmlSafe`.';

module.exports = class StyleConcatenation extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let style = AstNodeInfo.findAttribute(node, 'style');
        if (
          style &&
          (style.value.type === 'ConcatStatement' ||
            (style.value.type === 'MustacheStatement' && isConcatHelper(style.value.path)))
        ) {
          this.log({
            message: ERROR_MESSAGE,
            node: style,
          });
        }
      },
    };
  }
};

function isConcatHelper(node) {
  return node && node.type === 'PathExpression' && node.original === 'concat';
}

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
