'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const errorMessage = 'Avoid positive integer values for tabindex.';
const errorMessageForNaNCase = 'Tabindex values must be negative numeric.';

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
            if (tabindex.value.path.type === 'NumberLiteral') {
              tabindexValue = tabindex.value.path.original;
            } else if (tabindex.value.path.type === 'StringLiteral') {
              tabindexValue = parseInt(tabindex.value.path.original, 10);
            }
          }
        } else if (tabindex.value.type === 'ConcatStatement') {
          let part = tabindex.value.parts[0];
          if (part.type === 'MustacheStatement') {
            if (part.path.type === 'NumberLiteral') {
              tabindexValue = part.path.original;
            } else if (part.path.type === 'StringLiteral') {
              tabindexValue = parseInt(part.path.original, 10);
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
