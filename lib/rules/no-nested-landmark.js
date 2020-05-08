'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

function createErrorMessage(element) {
  return `Nested landmark elements on <${element}> detected. Landmark elements should not be nested within landmark elements of the same name.`;
}

// https://www.w3.org/TR/wai-aria-practices-1.1/#html-sectioning-elements
const LANDMARK_ELEMENTS = ['header', 'main', 'aside', 'form', 'main', 'nav', 'footer'];

// https://www.w3.org/TR/wai-aria-1.1/#landmark_roles
const ROLES = ['banner', 'main', 'complementary', 'form', 'search', 'navigation', 'contentinfo'];

module.exports = class NoNestedLandmark extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        if (this.isLandmarkElement(node)) {
          for (let parent of path.parents()) {
            if (this.isLandmarkElement(parent.node)) {
              this.log({
                message: createErrorMessage(node.tag),
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

  isLandmarkElement(node) {
    const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');
    return LANDMARK_ELEMENTS.includes(node.tag) || ROLES.includes(roleValue);
  }
};

module.exports.createErrorMessage = createErrorMessage;
