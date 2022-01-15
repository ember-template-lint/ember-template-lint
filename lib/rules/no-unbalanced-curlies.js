import { parse } from 'ember-template-recast';

import Rule from './_base.js';

const ERROR_MESSAGE = 'Unbalanced curlies detected';
const SUSPECT_CHARS = '}}';

const reLines = /(.*?(?:\r\n?|\n|$))/gm;

export default class NoUnbalancedCurlies extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let { chars } = node;
        if (!chars.includes(SUSPECT_CHARS)) {
          return;
        }
        let source = this.sourceForNode(node);

        let isMustache = false;
        try {
          let result = parse(chars);
          if (result.body.length && result.body[0].type === 'MustacheStatement') {
            isMustache = true;
          }
        } catch {
          // Not Mustache then. We'll proceed to find
          // the exact location of the error.
        }

        if (isMustache) {
          return;
        }

        let { loc } = node;
        let lineNum = loc.start.line;
        let colNum = loc.start.column;
        let lines = chars.match(reLines);
        for (const line of lines) {
          if (line.includes(SUSPECT_CHARS)) {
            this.log({
              message: ERROR_MESSAGE,
              line: lineNum,
              node,
              column: colNum + line.indexOf(SUSPECT_CHARS),
              source,
            });
          }
          lineNum++;
          colNum = 1;
        }
      },
    };
  }
}
