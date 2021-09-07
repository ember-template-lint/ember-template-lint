'use strict';

const Rule = require('./_base');

module.exports = class NoTrailingSpaces extends Rule {
  visitor() {
    return {
      Template: {
        // implementation goes here in exit(): in the exit handler, the rule will not
        // be called if it has been disabled by any inline comments within the file.

        exit(node) {
          let source = this.sourceForNode(node);

          for (const [i, line] of source.split('\n').entries()) {
            let column = line.length - 1;
            if (line[column] === ' ') {
              this.log({
                message: 'line cannot end with space',
                node,
                line: i + 1,
                column,
                source: line,
              });
            }
          }
        },
      },
    };
  }
};
