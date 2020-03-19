'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Unbalanced curlies detected';
const DISALLOWED_CHARS = '}}';

module.exports = class NoUnbalancedCurlies extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let chars = node.chars;
        if (chars.includes(DISALLOWED_CHARS)) {
          let loc = node.loc;
          this.log({
            message: ERROR_MESSAGE,
            line: loc && loc.start.line,
            column: loc && loc.start.column + chars.indexOf(DISALLOWED_CHARS),
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
