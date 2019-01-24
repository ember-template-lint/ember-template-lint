'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');
const PROHIBITED_ROLE_VALUES = [
  'command',
  'composite',
  'input',
  'landmark',
  'range',
  'roletype',
  'section',
  'sectionhead',
  'select',
  'structure',
  'widget',
  'window',
];

function attributeTextValue(attrNode) {
  if (!attrNode) {
    return;
  }
  if (attrNode.value && attrNode.value.type === 'TextNode') {
    return attrNode.value.chars;
  }
}

module.exports = class NoAbsctractRoles extends Rule {
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
        const roleAttr = AstNodeInfo.findAttribute(node, 'role');
        if (roleAttr) {
          const roleAttrValue = attributeTextValue(roleAttr);
          if (PROHIBITED_ROLE_VALUES.includes(roleAttrValue)) {
            this.logNode({
              message:
                'The HTML attribute role should never have the following value: ' + roleAttrValue,
              node,
            });
          }
        }
      },
    };
  }
};
