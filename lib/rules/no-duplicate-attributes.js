import Rule from './_base.js';

function logDuplicateAttributes(node, attributes, identifier, type) {
  let currentAttribute;
  let currentIndex = 0;
  let length = attributes.length;

  for (const [index, attribute] of attributes.entries()) {
    for (currentIndex = index + 1; currentIndex < length; currentIndex++) {
      currentAttribute = attributes[currentIndex];
      if (attribute[identifier] === currentAttribute[identifier]) {
        if (this.mode === 'fix') {
          if (type === 'Element') {
            return node.attributes.splice(currentIndex, 1);
          } else {
            return node.hash.pairs.splice(currentIndex, 1);
          }
        } else {
          this.log({
            message: `Duplicate attribute '${currentAttribute[identifier]}' found in the ${type}.`,
            node: currentAttribute,
            isFixable: true,
            source: this.sourceForNode(node),
          });
          break;
        }
      }
    }
  }
}

export default class NoDuplicateAttributes extends Rule {
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
}
