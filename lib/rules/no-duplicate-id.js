'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';

function isValidIdAttrNode(attrNode) {
  let isIdAttrTag = ['id', '@id'].includes(attrNode.name);
  let isValidAttrNodeType = ['TextNode','MustacheStatement','ConcatStatement'].includes(attrNode.value.type);
  return attrNode && isIdAttrTag && isValidAttrNodeType;
};
module.exports = class NoDuplicateId extends Rule {
  visitor() {
    let attrIdSet = new Set();
    return {
      AttrNode(node) {

        // TODO: Use isValidIdAttrNode
        if (!(node.name === 'id')) {
          return;
        }
        if (node.value.type !== 'TextNode') {
          return;
        }

        let idValue;

        // TODO: Add Mustache + Concat
        idValue = node.value.chars;

        let isDuplicate = attrIdSet.has(idValue);

        if (isDuplicate) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        } else {
          attrIdSet.add(idValue);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
