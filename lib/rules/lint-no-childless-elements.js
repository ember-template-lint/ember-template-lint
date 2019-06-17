'use strict';

const Rule = require('./base');

const BLOCK_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'ul', 'ol', 'li', 'div'];
const ERROR_MESSAGE = 'Empty non-void elements are not allowed';

module.exports = class NoChildlessElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const isNonVoidTag = BLOCK_TAGS.includes(node.tag);
        const isElementEmpty = !node.children.length;
        const shouldDisplayMessage = isNonVoidTag && isElementEmpty;

        if (shouldDisplayMessage) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc.start.line,
            column: node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.BLOCK_TAGS = BLOCK_TAGS;
module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
