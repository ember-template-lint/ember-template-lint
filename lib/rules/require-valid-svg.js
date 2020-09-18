'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

function getParentLinkOrButton(path) {
  // Parental validation (descriptive elements)
  let parents = [...path.parents()];
  let parentPath = parents.find(
    (parent) => parent.node.type === 'ElementNode' && ['button', 'a'].includes(parent.node.tag)
  );

  return parentPath ? parentPath.node : undefined;
}

function hasParentAValidAriaLabel(path) {
  const parent = getParentLinkOrButton(path);
  const hasAriaLabel = AstNodeInfo.hasAttribute(parent, 'aria-label');

  return hasAriaLabel && AstNodeInfo.elementAttributeValue(parent, 'aria-label').trim() !== '';
}

function hasNoneEmptyTitleChild(node) {
  const title = node.children.find(
    (child) => child.type === 'ElementNode' && child.tag === 'title'
  );

  if (title) {
    return title.children.some((child) => child.type === 'TextNode' && child.chars.trim() !== '');
  }
  return false;
}

module.exports = class RequireValidSVG extends Rule {
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
      ElementNode(node, path) {
        if (AstNodeInfo.isSVGElement(node) === false) {
          return;
        }

        let parent = getParentLinkOrButton(path);
        if (parent) {
          // Check '...attributes' ?
          if (AstNodeInfo.hasAttributeValue(node, 'aria-hidden', 'true') === false) {
            return this.logNode({
              message:
                'An `<svg>` element inside a `<a>` or `<button>` element should have the `aria-hidden` attribute set to true',
              node,
            });
          }

          // Check '...attributes' ?
          if (hasParentAValidAriaLabel(path) === false) {
            return this.logNode({
              message:
                'Parent tag of an `<svg>` element should have an none empty `aria-label` attribute',
              node: parent,
            });
          }
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
