'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

function createErrorMessage(element) {
  return `Duplicate label on <${element}> detected. If two of the same landmark elements or landmark roles are found in the same template, ensure that they have a unique label (provided by the aria-label or aria-labelledby attribute).`;
}

const ROLE_LANDMARK_MAP = {
  banner: 'header',
  main: 'main',
  complementary: 'aside',
  form: 'form',
  search: 'form',
  navigation: 'nav',
  contentinfo: 'footer',
};

const LANDMARK_ELEMENTS = ['header', 'main', 'aside', 'form', 'main', 'nav', 'footer'];

const LANDMARK_ROLES = Object.keys(ROLE_LANDMARK_MAP);

module.exports = class NoDuplicateLandmarkLabels extends Rule {
  constructor(options) {
    super(options);
    this._landmarkHash = [];
  }

  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        // Return if it is not a landmark element or doesn't have role
        if (!(hasRoleAttribute || LANDMARK_ELEMENTS.includes(node.tag))) {
          return;
        }

        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');

        // <nav>
        const isLandMarkElement = LANDMARK_ELEMENTS.includes(node.tag);

        // <div role="navigation">
        const isLandMarkRole = LANDMARK_ROLES.includes(roleValue);

        if (isLandMarkElement || isLandMarkRole) {
          // check for label
          const label = AstNodeInfo.elementAttributeValue(node, 'aria-label') || '';

          const landmark = isLandMarkElement ? node.tag : ROLE_LANDMARK_MAP[roleValue];
          let current = { landmark, label };

          const isNotUnique = this._landmarkHash.find((e) => {
            let landmarkRole = isLandMarkElement ? node.tag : ROLE_LANDMARK_MAP[roleValue];
            return e.landmark === landmarkRole && e.label === label;
          });

          if (isNotUnique) {
            this.log({
              message: createErrorMessage(node.tag),
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          } else {
            this._landmarkHash.push(current);
          }
        }
      },
    };
  }
};

module.exports.createErrorMessage = createErrorMessage;
