// lint-no-whitespace-for-layout.js
'use strict';
const Rule = require('./base');

const ERROR_MESSAGE = 'Excess whitespace detected.';

module.exports = class noWhitespaceForLayout extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let source = this.sourceForNode(node);
        // this regex checks for a space or html entity space plus another space or html entity space
        let matches = source.match(/(( )|(&nbsp;))(( )|(&nbsp;))/g);
        if (matches !== null) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
