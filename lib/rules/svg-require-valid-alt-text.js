'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

// TODO Change template to the real error message that you want to report
const ERROR_MESSAGE = 'Error Message to Report';

function hasNoneEmptyTitleChild(node) {
  const title = node.children.find(
    (child) => child.type === 'ElementNode' && child.tag === 'title'
  );

  if (title) {
    return title.children.some((child) => child.type === 'TextNode' && child.chars.trim() !== '');
  }
  return false;
}

module.exports = class SvgRequireValidAltText extends Rule {
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
        if (AstNodeInfo.isSVGElement(node) === false) {
          return;
        }
        const hasRoleImage = AstNodeInfo.hasAttributeValue(node, 'role', 'image');
        const hasAltAttribute = AstNodeInfo.hasAttribute(node, 'alt');
        const hasNoneEmptyAltAttribute =
          hasAltAttribute && AstNodeInfo.elementAttributeValue(node, 'alt').trim() !== '';

        if (hasRoleImage) {
          if (AstNodeInfo.hasAttribute(node, 'hidden')) {
            return;
          }

          if (AstNodeInfo.hasAttributeValue(node, 'aria-hidden', 'true')) {
            return;
          }

          if (AstNodeInfo.hasAttribute(node, '...attributes')) {
            return;
          }

          if (hasRoleImage && hasNoneEmptyAltAttribute === false) {
            return this.logNode({
              message:
                'An `<svg>` element with role `image` should have a none empty alternative text',
              node,
            });
          }

          if (!AstNodeInfo.hasChildren(node) || hasNoneEmptyTitleChild(node) === false) {
            return this.logNode({
              message:
                'An `<svg>` element with role `image` should contains contain a none empty `<title>` element',
              node,
            });
          }
        } else {
          // Check '...attributes', 'aria-hidden', hidden ?
          if (hasAltAttribute) {
            this.logNode({
              message:
                'An `<svg>` element without role `image` should not have the `alt` attribute defined',
              node,
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
