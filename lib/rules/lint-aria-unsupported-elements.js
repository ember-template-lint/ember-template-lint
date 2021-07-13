'use strict';

const Rule = require('./base');
const PROHIBITED_TAG_NAMES = ['meta', 'html', 'script', 'style'];

module.exports = class AriaUnsupportedElement extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }
  visitor() {
    return {
      ElementNode(node) {
        if (PROHIBITED_TAG_NAMES.includes(node.tag)) {
          let invalidAttributeName = null;
          for (var i = 0; i < node.attributes.length; i++) {
            var attribute = node.attributes[i];

            if (attribute.name === 'role' || attribute.name.indexOf('aria-') === 0) {
              invalidAttributeName = attribute.name;
              break;
            }
          }
          if (invalidAttributeName !== null) {
            this.logNode({
              message: node.tag + ' tag must not contain "' + invalidAttributeName + '" attribute',
              node,
            });
          }
        }
      },
    };
  }
};
