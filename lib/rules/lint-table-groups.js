'use strict';

const Rule = require('./base');
const message = 'Tables must have a table group (thead, tbody or tfoot).';

const ALLOWED_TABLE_CHILDREN = ['thead', 'tbody', 'tfoot', 'caption', 'colgroup'];

function hasDisallowedChildren(tableNode) {
  return tableNode.children.some(
    child =>
      !(
        (child.type === 'ElementNode' && ALLOWED_TABLE_CHILDREN.indexOf(child.tag) > -1) ||
        (child.type === 'TextNode' && !/\S/.test(child.chars))
      )
  );
}

function hasChildTags(tableNode) {
  const contentNodes = tableNode.children.filter(child => {
    return child.type !== 'TextNode';
  });

  return contentNodes.length > 0;
}

module.exports = class TableGroups extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'table') {
          if (!hasChildTags(node)) {
            return;
          }

          if (hasDisallowedChildren(node)) {
            this.log({
              message,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
    };
  }
};

module.exports.message = message;
