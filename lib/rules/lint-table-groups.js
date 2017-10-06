'use strict';

const Rule = require('./base');
const message = 'Tables must have a table group (thead, tbody or tfoot).';

const TABLE_GROUPS = ['thead', 'tbody', 'tfoot'];

function hasTableGroup(tableNode) {
  const tableGroup = tableNode.children.find((child) => {
    return child.type === 'ElementNode' && TABLE_GROUPS.indexOf(child.tag) > -1;
  });

  return !!tableGroup;
}

function hasTableRows(tableNode) {
  const tableRow = tableNode.children.find((child) => {
    return child.type === 'ElementNode' && child.tag === 'tr';
  });

  return !!tableRow;
}

function hasChildTags(tableNode) {
  const contentNodes = tableNode.children.filter((child) => {
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

          if (!hasTableGroup(node) || hasTableRows(node)) {
            this.log({
              message: message,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node)
            });
          }
        }
      }
    };
  }
};

module.exports.message = message;
