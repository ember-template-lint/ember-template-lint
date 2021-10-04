'use strict';

const { parse } = require('ember-template-recast');

const Rule = require('./_base');

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
        let source = this.sourceForNode(node);

        let { loc } = node;

        if (!loc) {
          this.log({
            message: ERROR_MESSAGE,
            source,
            node,
          });
          return;
        }

        let lineNum = loc.start.line;
        let colNum = loc.start.column;
        let lines = chars.match(reLines);
        for (const line of lines) {
          if (line.includes(DISALLOWED_CHARS)) {
            let isMustache = false;
            try {
              let result = parse(line);
              if (result.body.length && result.body[0].type === 'MustacheStatement') {
                isMustache = true;
              }
            } catch {
              isMustache = false;
            }
            if (!isMustache) {
              this.log({
                message: ERROR_MESSAGE,
                line: lineNum,
                node,
                column: colNum + line.indexOf(DISALLOWED_CHARS),
                source,
              });
            }
          }
          lineNum++;
          colNum = 1;
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
