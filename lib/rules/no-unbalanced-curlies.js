'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Unbalanced curlies detected';
const DISALLOWED_CHARS = '}}';

const reLines = /(.*?(?:\r\n?|\n|$))/gm;

module.exports = class NoUnbalancedCurlies extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let { chars } = node;
        if (!chars.includes(DISALLOWED_CHARS)) {
          return;
        }
        let { loc } = node;

        if (!loc) {
          this.log({
            message: ERROR_MESSAGE,
            source: this.sourceForNode(node),
          });
          return;
        }

        let lineNum = loc.start.line;
        let colNum = loc.start.column;
        let lines = chars.match(reLines);
        for (const line of lines) {
          if (line.includes(DISALLOWED_CHARS)) {
            this.log({
              message: ERROR_MESSAGE,
              line: lineNum,
              column: colNum + line.indexOf(DISALLOWED_CHARS),
              source: this.sourceForNode(node),
            });
          }
          lineNum++;
          colNum = 1;
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
