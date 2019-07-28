'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const errorMessage = 'Avoid positive integer values for tabindex.';
const errorMessageForNaNCase = 'Tabindex values must be negative numeric.';

function literalValueToNumber(astNode) {
  if (astNode.type === 'NumberLiteral') {
    return astNode.original;
  } else if (astNode.type === 'StringLiteral') {
    return parseInt(astNode.original, 10);
  } else {
    return NaN;
  }
}

function maybeLiteralValue(astNode, defaultValue) {
  if (['NumberLiteral', 'StringLiteral'].includes(astNode.type)) {
    return literalValueToNumber(astNode);
  } else {
    return defaultValue;
  }
}
module.exports = class NoPositiveTabindex extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const tabindex = AstNodeInfo.findAttribute(node, 'tabindex');

        if (!tabindex || !tabindex.value) {
          return;
        }

        let tabindexValue = NaN;

        if (tabindex.value.type === 'MustacheStatement') {
          if (tabindex.value.path) {
            tabindexValue = maybeLiteralValue(tabindex.value.path, tabindexValue);
          }
        } else if (tabindex.value.type === 'ConcatStatement') {
          let part = tabindex.value.parts[0];
          if (part.type === 'MustacheStatement') {
            if (['NumberLiteral', 'StringLiteral'].includes(part.path.type)) {
              tabindexValue = literalValueToNumber(part.path);
            } else if (part.path.type === 'PathExpression' && part.path.original === 'if') {
              if (part.params.length === 2 || part.params.length === 3) {
                tabindexValue = maybeLiteralValue(part.params[1], tabindexValue);
              }
              if (part.params.length === 3) {
                let maybeTabindexValue = maybeLiteralValue(part.params[2], tabindexValue);
                if (maybeTabindexValue > tabindexValue) {
                  tabindexValue = maybeTabindexValue;
                }
              }
            }
          }
        } else if (tabindex.value.type === 'TextNode') {
          tabindexValue = parseInt(tabindex.value.chars, 10);
        }

        if (isNaN(tabindexValue)) {
          this.log({
            message: errorMessageForNaNCase,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(tabindex),
          });
        } else if (tabindexValue > 0) {
          this.log({
            message: errorMessage,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(tabindex),
          });
        }
      },
    };
  }
};
