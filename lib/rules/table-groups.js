'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const message = 'Tables must have a table group (thead, tbody or tfoot).';
const orderingMessage =
  'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).';

const ALLOWED_TABLE_CHILDREN = ['caption', 'colgroup', 'thead', 'tbody', 'tfoot'];

// For effective children, we skip over any control flow helpers,
// since we know that they don't render anything on their own
function getEffectiveChildren(node) {
  const unflattenedEffectiveChildren = AstNodeInfo.childrenFor(node).map((node) => {
    if (AstNodeInfo.isControlFlowHelper(node)) {
      return getEffectiveChildren(node);
    } else {
      return [node];
    }
  });

  return [].concat.apply([], unflattenedEffectiveChildren); // eslint-disable-line prefer-spread
}

function isAllowedTableChild(node) {
  let tagNamePair;
  let tagNameAttribute;
  let index;
  switch (node.type) {
    case 'BlockStatement':
    case 'MustacheStatement':
      tagNamePair = node.hash.pairs.find((pair) => pair.key === 'tagName');
      if (tagNamePair) {
        index = ALLOWED_TABLE_CHILDREN.indexOf(tagNamePair.value.value);
        return { allowed: index > -1, index };
      } else if (node.path.original === 'yield') {
        return { allowed: true, index: -1 };
      }
      break;
    case 'ElementNode':
      index = ALLOWED_TABLE_CHILDREN.indexOf(node.tag);
      if (index > -1) {
        return { allowed: true, index };
      }
      tagNameAttribute = node.attributes.find((attribute) => attribute.name === '@tagName');
      if (tagNameAttribute) {
        index = ALLOWED_TABLE_CHILDREN.indexOf(tagNameAttribute.value.chars);
        return { allowed: index > -1, index };
      }
      break;
    case 'CommentStatement':
    case 'MustacheCommentStatement':
      return { allowed: true, index: -1 };
    case 'TextNode':
      return { allowed: !/\S/.test(node.chars), index: -1 };
  }

  return { allowed: false };
}

module.exports = class TableGroups extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'table') {
          const children = getEffectiveChildren(node);
          let currentAllowedIndex = 0;
          for (let i = 0; i < children.length; i++) {
            const allowedWithIndex = isAllowedTableChild(children[i]);
            if (!allowedWithIndex.allowed) {
              this.log({
                message,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
              });
              break;
            }
            if (allowedWithIndex.index > -1 && allowedWithIndex.index < currentAllowedIndex) {
              this.log({
                message: orderingMessage,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
              });
              break;
            }
            currentAllowedIndex = allowedWithIndex.index;
          }
        }
      },
    };
  }
};

module.exports.message = message;
module.exports.orderingMessage = orderingMessage;
