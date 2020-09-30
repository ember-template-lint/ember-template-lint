'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE =
  'If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.';

const ROLE_LANDMARK_MAP = {
  banner: 'header',
  main: 'main',
  complementary: 'aside',
  form: 'form',
  search: 'form',
  navigation: 'nav',
  contentinfo: 'footer',
};

const LANDMARK_ELEMENTS = new Set(['header', 'main', 'aside', 'form', 'nav', 'footer']);

const LANDMARK_ROLES = Object.keys(ROLE_LANDMARK_MAP);

module.exports = class RequireLandmarkLabels extends Rule {
  constructor(options) {
    super(options);
    this._landmarkHash = [];
  }

  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        // Return if it is not a landmark element or doesn't have role
        // or if the role value is not a string literal
        if (
          (hasRoleAttribute ||
            LANDMARK_ELEMENTS.has(node.tag) ||
            hasRoleAttribute.value.type === 'TextNode') === false
        ) {
          return;
        }

        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');

        // <nav>
        const isLandMarkElement = LANDMARK_ELEMENTS.has(node.tag);

        // <div role="navigation">
        const isLandMarkRole = LANDMARK_ROLES.includes(roleValue);

        if (isLandMarkElement || isLandMarkRole) {
          // check for accessible label via aria-label or aria-labelledby
          const label =
            AstNodeInfo.elementAttributeValue(node, 'aria-label') ||
            AstNodeInfo.elementAttributeValue(node, 'aria-labelledby') ||
            '';

          const landmark = isLandMarkElement ? node.tag : ROLE_LANDMARK_MAP[roleValue];
          let current = { landmark, label };

          const isNotUnique = this._landmarkHash.find((e) => {
            let landmarkRole = isLandMarkElement ? node.tag : ROLE_LANDMARK_MAP[roleValue];
            return e.landmark === landmarkRole && e.label === label;
          });

          if (isNotUnique) {
            this.log({
              message: ERROR_MESSAGE,
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

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
