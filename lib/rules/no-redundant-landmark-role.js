'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

function createErrorMessage(element, role) {
  return `Use of redundant or invalid role: ${role} on <${element}> detected. If a landmark element is used, any role provided will either be redundant or incorrect.`;
}

// https://www.w3.org/TR/html-aria/#docconformance
const LANDMARK_ROLES = [
  {
    name: 'header',
    role: 'banner',
  },
  {
    name: 'main',
    role: 'main',
  },
  {
    name: 'aside',
    role: 'complementary',
  },
  {
    name: 'form',
    role: 'search',
    allow: true,
  },
  {
    name: 'form',
    role: 'form',
  },
  {
    name: 'nav',
    role: 'navigation',
  },
  {
    name: 'footer',
    role: 'contentinfo',
    allow: true,
  },
];

module.exports = class NoRedundantLandmarkRole extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        if (!hasRoleAttribute) {
          return;
        }

        const landmarkElements = LANDMARK_ROLES.map((e) => e.name);
        if (!landmarkElements.includes(node.tag)) {
          return;
        }

        let roleAttrNode = AstNodeInfo.findAttribute(node, 'role');
        let roleValue;
        if (roleAttrNode.value.type === 'TextNode') {
          roleValue = roleAttrNode.value.chars || '';
        }

        const invalidLandmark = LANDMARK_ROLES.find((e) => {
          return e.name === node.tag && e.role === roleValue && !e.allow;
        });

        if (invalidLandmark) {
          if (this.mode === 'fix') {
            let roleAttrNode = AstNodeInfo.findAttribute(node, 'role');
            node.attributes = node.attributes.filter((attrNode) => attrNode !== roleAttrNode);
          } else {
            this.log({
              message: createErrorMessage(node.tag, roleValue),
              node,
              isFixable: true,
            });
          }
        }
      },
    };
  }
};

module.exports.createErrorMessage = createErrorMessage;
