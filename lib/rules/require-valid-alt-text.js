'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

function hasAccessibleChild(node) {
  return AstNodeInfo.hasChildren(node);
}

const REDUNDANT_WORDS = ['image', 'photo', 'picture', 'logo', 'spacer'];

const ERROR_MESSAGE =
  'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.';

module.exports = class RequireValidAltText extends Rule {
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
      // eslint-disable-next-line complexity
      ElementNode(node) {
        if (AstNodeInfo.hasAttribute(node, 'hidden')) {
          return;
        }

        if (AstNodeInfo.hasAttributeValue(node, 'aria-hidden', 'true')) {
          return;
        }

        if (AstNodeInfo.hasAttribute(node, '...attributes')) {
          return;
        }

        const isImg = AstNodeInfo.isImgElement(node);
        const isObj = AstNodeInfo.isObjectElement(node);
        const isInput = AstNodeInfo.isInputElement(node);
        const isArea = AstNodeInfo.isAreaElement(node);

        if (isImg) {
          const hasAltAttribute = AstNodeInfo.hasAttribute(node, 'alt');
          const altValue = AstNodeInfo.elementAttributeValue(node, 'alt');
          const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');
          const srcValue = AstNodeInfo.elementAttributeValue(node, 'src');
          const hasRole = AstNodeInfo.hasAttribute(node, 'role');

          // if the role value is a mustache statement we can not validate it
          if (hasAltAttribute && hasRole && !roleValue.type) {
            if (
              ['none', 'presentation'].includes(roleValue.trim().toLowerCase()) &&
              altValue !== ''
            ) {
              this.logNode({
                message:
                  'The `alt` attribute should be empty if `<img>` has `role` of `none` or `presentation`',
                node,
              });
            }
          }

          if (!hasAltAttribute) {
            this.logNode({
              message: 'All `<img>` tags must have an alt attribute',
              node,
            });
          } else if (altValue === srcValue) {
            this.logNode({
              message: 'The alt text must not be the same as the image source',
              node,
            });
          } else {
            const altAttribute = AstNodeInfo.findAttribute(node, 'alt');
            if (altAttribute.value) {
              let normalizedAltValue = '';
              if (altAttribute.value.type === 'TextNode') {
                normalizedAltValue = altAttribute.value.chars.trim().toLowerCase();
              } else if (altAttribute.value.type === 'ConcatStatement') {
                normalizedAltValue = altAttribute.value.parts
                  .filter((part) => part.type === 'TextNode')
                  .map((part) => part.chars)
                  .join(' ')
                  .trim()
                  .toLowerCase();
                if (normalizedAltValue === '') {
                  normalizedAltValue = null;
                }
              } else {
                normalizedAltValue = null;
              }

              if (normalizedAltValue === '') {
                if (['presentation', 'none'].includes(roleValue)) {
                  return;
                }
                this.logNode({
                  message:
                    'If the `alt` attribute is present and the value is an empty string, `role="presentation"` or `role="none"` must be present',
                  node,
                });
                return;
              }

              if (normalizedAltValue !== null) {
                if (/^\d+$/g.test(normalizedAltValue)) {
                  this.logNode({
                    message: 'A number is not valid alt text',
                    node,
                  });
                } else {
                  const existingWords = REDUNDANT_WORDS.filter((word) =>
                    normalizedAltValue.includes(word)
                  );
                  if (existingWords.length) {
                    this.logNode({
                      message: ERROR_MESSAGE,
                      node,
                    });
                  }
                }
              }
            }
          }
        } else if (isInput) {
          const isImageInput = AstNodeInfo.hasAttributeValue(node, 'type', 'image');
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
                'All <input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
              node,
            });
          }
        } else if (isObj) {
          const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');
          const hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, [
            'aria-label',
            'aria-labelledby',
            'title',
          ]);

          if (
            hasValidAttributes ||
            hasAccessibleChild(node) ||
            ['presentation', 'none'].includes(roleValue)
          ) {
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

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
