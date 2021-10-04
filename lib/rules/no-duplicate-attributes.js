'use strict';

const Rule = require('./_base');

function logDuplicateAttributes(node, attributes, identifier, type) {
  let currentAttribute;
  let currentIndex = 0;
  let length = attributes.length;

  for (const [index, attribute] of attributes.entries()) {
    for (currentIndex = index + 1; currentIndex < length; currentIndex++) {
      currentAttribute = attributes[currentIndex];
      if (attribute[identifier] === currentAttribute[identifier]) {
        this.log({
          message: `Duplicate attribute '${currentAttribute[identifier]}' found in the ${type}.`,
          node: currentAttribute,
          source: this.sourceForNode(node),
        });
        break;
      }
    }
  }
}

module.exports = class NoDuplicateAttributes extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        logDuplicateAttributes.call(this, node, node.attributes, 'name', 'Element');
      },

      BlockStatement(node) {
        let attributes = (node.hash || {}).pairs || [];
        logDuplicateAttributes.call(this, node, attributes, 'key', 'BlockStatement');
      },

      MustacheStatement(node) {
        let attributes = (node.hash || {}).pairs || [];
        logDuplicateAttributes.call(this, node, attributes, 'key', 'MustacheStatement');
      },

      SubExpression(node) {
        let attributes = (node.hash || {}).pairs || [];
        logDuplicateAttributes.call(this, node, attributes, 'key', 'SubExpression');
      },
    };
  }
};
