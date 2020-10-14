'use strict';
const Rule = require('./base');

const ERROR_MESSAGE = 'Excess whitespace detected.';

module.exports = class NoWhitespaceForLayout extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let source = this.sourceForNode(node);

        let lines = source.split('\n');
        for (let line of lines) {
          // ignore whitespace at the start and end of the line
          let trimmed = line.trim();

          // check for two ` ` or `&nbsp;` in a row
          let matches = trimmed.match(/(( )|(&nbsp;))(( )|(&nbsp;))/g);
          if (matches !== null) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });

            return;
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
