// lint-no-whitespace-for-layout.js
'use strict';
const Rule = require('./base');

module.exports = class noWhitespaceForLayout extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let source = this.sourceForNode(node);
        let matches = source.match(/(( )|(\&nbsp\;))(( )|(\&nbsp\;))/g);
        if (matches !== null) {
          this.log({
            message: 'Excess space detected',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};
