'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

function createErrorMessage(element) {
  return `Duplicate label on <${element}> detected. If two of the same landmark elements or landmark roles are found in the same template, ensure that they have a unique label (provided by the aria-label or aria-labelledby attribute).`;
}

const LANDMARK_ELEMENTS = ['header', 'main', 'aside', 'form', 'main', 'nav', 'footer'];

const LANDMARK_ROLES = [
  'banner',
  'main',
  'aside',
  'form',
  'main',
  'search',
  'navigation',
  'contentinfo',
];

module.exports = class NoDuplicateLandmkarLabels extends Rule {
  landmarkElements = [];

  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        // Return if it is not a landmark element or doesn't have role
        if (!(hasRoleAttribute || LANDMARK_ELEMENTS.includes(node.tag))) {
          return;
        }

        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');

        const isLandMarkElement = LANDMARK_ELEMENTS.includes(node.tag);
        const isLandMarkRole = LANDMARK_ROLES.includes(roleValue.toLowerCase());

        if (isLandMarkElement || isLandMarkRole) {
          // check for label
          const labelValue = AstNodeInfo.elementAttributeValue(node, 'aria-label');
        }

        let source = this.sourceForNode(node);
        let disallowedText = 'DisallowedText';
        let failingCondition = source.includes(disallowedText);
        if (failingCondition) {
          this.log({
            message: createErrorMessage(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.createErrorMessage = createErrorMessage;
