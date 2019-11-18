'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

function ERROR_MESSAGE_INVALID_ROLE(element) {
  return `Use of presentation role on <${element}> detected. Semantic elements should not be used for presentation.`;
}

const ALLOWED_ELEMENTS = ['div', 'img', 'span', 'svg'];

module.exports = class NoInvalidRole extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');
        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');
        if (hasRoleAttribute) {
          if (
            roleValue
              .trim()
              .toLowerCase()
              .includes('presentation') ||
            roleValue
              .trim()
              .toLowerCase()
              .includes('none')
          ) {
            if (!ALLOWED_ELEMENTS.includes(node.tag)) {
              this.log({
                message: ERROR_MESSAGE_INVALID_ROLE(node.tag),
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
              });
            }
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE_INVALID_ROLE = ERROR_MESSAGE_INVALID_ROLE;
