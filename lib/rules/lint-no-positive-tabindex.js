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

        if (!tabindex || !tabindex.value || tabindex.value.type !== 'TextNode') {
          return;
        }

        const tabindexValue = tabindex.value.chars;
        const parsedTabindexValue = parseInt(tabindexValue, 10);

        if (isNaN(parsedTabindexValue)) {
          this.log({
            message: errorMessageForNaNCase,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        } else if (parsedTabindexValue > 0) {
          this.log({
            message: errorMessage,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};
