'use strict';

const Rule = require('./base');
const message = 'Tables must have a table group (thead, tbody or tfoot).';

const ALLOWED_TABLE_CHILDREN = ['thead', 'tbody', 'tfoot', 'caption', 'colgroup'];

function hasDisallowedChildren(tableNode) {
  const validBlocks = tableNode.children.filter(node => {
    const isBlock = node.type === 'BlockStatement';
    if (!isBlock) {
      return false;
    }
    const isIf = node.path.original === 'if';
    const isUnless = node.path.original === 'unless';
    return isIf || isUnless;
  });
  const childrenFromValidBlocks = [].concat.apply(
    [],
    validBlocks.map(block => [].concat(block.program.body, block.inverse ? block.inverse.body : []))
  );
  return ![]
    .concat(
      childrenFromValidBlocks,
      tableNode.children.filter(item => validBlocks.indexOf(item) === -1)
    )
    .every(isAllowedTableChild);
}

function isAllowedTableChild(node) {
  let tagNamePair;
  let tagNameAttribute;
  switch (node.type) {
    case 'MustacheStatement':
      tagNamePair = node.hash.pairs.find(pair => pair.key === 'tagName');
      if (tagNamePair) {
        return ALLOWED_TABLE_CHILDREN.includes(tagNamePair.value.value);
      } else if (node.path.original === 'yield') {
        return true;
      }
      break;
    case 'ElementNode':
      if (ALLOWED_TABLE_CHILDREN.includes(node.tag)) {
        return true;
      }
      tagNameAttribute = node.attributes.find(attribute => attribute.name === '@tagName');
      if (tagNameAttribute) {
        return ALLOWED_TABLE_CHILDREN.includes(tagNameAttribute.value.chars);
      }
      break;
    case 'TextNode':
      return !/\S/.test(node.chars);
  }

  return false;
}

function hasChildTags(tableNode) {
  const contentNodes = tableNode.children.filter(child => {
    return ['TextNode', 'CommentStatement', 'MustacheCommentStatement'].indexOf(child.type) === -1;
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
