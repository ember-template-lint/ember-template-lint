'use strict';

const Rule = require('./base');

function logDuplicateAttributes(node, attributes, indentifier, type) {
  let currentAttribute;
  let currentIndex = 0;
  let length = attributes.length;

  attributes.forEach((attribute, index) => {
    for (currentIndex = index + 1; currentIndex < length; currentIndex++) {
      currentAttribute = attributes[currentIndex];
      if (attribute[indentifier] === currentAttribute[indentifier]) {
        this.log({
          message: `Duplicate attribute '${currentAttribute[indentifier]}' found in the ${type}.`,
          line: currentAttribute.loc && currentAttribute.loc.start.line,
          column: currentAttribute.loc && currentAttribute.loc.start.column,
          source: this.sourceForNode(node),
        });
        break;
      }
    }
  });
}

module.exports = class DuplicateAttributes extends Rule {
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
