'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

function createErrorMessage(element) {
  return `Nested landmark elements on <${element}> detected. Landmark elements should not be nested within landmark elements of the same name.`;
}

const LANDMARK_ELEMENTS = ['header', 'main', 'aside', 'form', 'main', 'nav', 'footer'];
const ROLES = ['banner', 'main', 'complementary', 'form', 'search', 'navigation', 'contentinfo'];

module.exports = class NoNestedLandmark extends Rule {
  visitor() {
    this._parentLandmarkNode = null;

    let checkNode = {
      enter(node) {
        let isLandmark = this.isLandmarkElement(node);

        if (!isLandmark) {
          return;
        }

        if (this.hasParentNode()) {
          this.log({
            message: createErrorMessage(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        } else {
          this._parentLandmarkNode = node;
        }
      },

      exit(node) {
        if (this._parentLandmarkNode === node) {
          this._parentLandmarkNode = null;
        }
      },
    };

    return {
      ElementNode: checkNode,
    };
  }

  isLandmarkElement(node) {
    const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');
    return LANDMARK_ELEMENTS.includes(node.tag) || ROLES.includes(roleValue);
  }

  hasParentNode() {
    return this._parentLandmarkNode;
  }
};

module.exports.createErrorMessage = createErrorMessage;
