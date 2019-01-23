'use strict';

const AstNodeInfo = require('../../helpers/ast-node-info');
const Rule = require('./../base');

function hasAccessibleChild(node) {
  return AstNodeInfo.hasChildren(node);
}

module.exports = class A11yLintAltText extends Rule {
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
        const isImg = AstNodeInfo.isImgElement(node);
        const isObj = AstNodeInfo.isObjectElement(node);
        const isInput = AstNodeInfo.isInput(node);
        const isArea = AstNodeInfo.isAreaElement(node);
        const hasAreaHiddenAttribute = AstNodeInfo.nodeHasAttributeValue(
          node,
          'aria-hidden',
          'true'
        );
        if (hasAreaHiddenAttribute) {
          return;
        }
        if (isImg) {
          const hasAltAttribute = AstNodeInfo.hasAttribute(node, 'alt');
          if (hasAreaHiddenAttribute) {
            return;
          }
          if (!hasAltAttribute) {
            this.logNode({
              message:
                'img tags must have an alt attribute, either with meaningful text, or an empty string for decorative images.',
              node,
            });
          }
        } else if (isInput) {
          const isImageInput = AstNodeInfo.nodeHasAttributeValue(node, 'type', 'image');
          if (!isImageInput) {
            return;
          }
          const hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, [
            'aria-label',
            'aria-labelledby',
            'alt',
          ]);

          if (!hasValidAttributes) {
            this.logNode({
              message:
                '<input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
              node,
            });
          }
        } else if (isObj) {
          const hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, [
            'aria-label',
            'aria-labelledby',
            'title',
          ]);

          if (hasValidAttributes || hasAccessibleChild(node)) {
            return;
          }

          this.logNode({
            message:
              'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.',
            node,
          });
        } else if (isArea) {
          if (!AstNodeInfo.hasAnyAttribute(node, ['aria-label', 'aria-labelledby', 'alt'])) {
            this.logNode({
              message:
                'Each area of an image map must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
              node,
            });
          }
        }
      },
    };
  }
};
