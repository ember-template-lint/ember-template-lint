import AstNodeInfo from '../helpers/ast-node-info.js';
import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

function hasAccessibleChild(node) {
  return AstNodeInfo.hasChildren(node);
}

const REDUNDANT_WORDS = ['image', 'photo', 'picture', 'logo', 'spacer'];

const ERROR_MESSAGE =
  'Invalid alt attribute. Words such as `image`, `photo,` or `picture` are already announced by screen readers.';

export default class RequireValidAltText extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
    });
  }

  visitor() {
    return {
      ElementNode(node) {
        if (AstNodeInfo.hasAttribute(node, 'hidden')) {
          return;
        }

        let hasAriaHiddenAttr = AstNodeInfo.hasAttribute(node, 'aria-hidden');
        if (hasAriaHiddenAttr) {
          let ariaHiddenAttr = AstNodeInfo.findAttribute(node, 'aria-hidden');
          if (ariaHiddenAttr.value.type === 'TextNode' && ariaHiddenAttr.value.chars === 'true') {
            return;
          }
        }

        if (AstNodeInfo.hasAttribute(node, '...attributes')) {
          return;
        }

        const isImg = node.tag === 'img';
        const isObj = node.tag === 'object';
        const isInput = node.tag === 'input';
        const isArea = node.tag === 'area';

        if (isImg) {
          const hasAltAttribute = AstNodeInfo.hasAttribute(node, 'alt');
          let altAttribute, altValue;
          if (hasAltAttribute) {
            altAttribute = AstNodeInfo.findAttribute(node, 'alt');
            if (altAttribute.value.type === 'TextNode') {
              altValue = altAttribute.value.chars;
            } else {
              altValue = altAttribute.value;
            }
          }
          const hasRole = AstNodeInfo.hasAttribute(node, 'role');
          let roleAttr, roleValue;
          if (hasRole) {
            roleAttr = AstNodeInfo.findAttribute(node, 'role');
            if (roleAttr.value.type === 'TextNode') {
              roleValue = roleAttr.value.chars;
            } else {
              roleValue = roleAttr.value;
            }
          }

          let hasSrcAttr = AstNodeInfo.hasAttribute(node, 'src');
          let srcAttr, srcValue;
          if (hasSrcAttr) {
            srcAttr = AstNodeInfo.findAttribute(node, 'src');
            if (srcAttr.value.type === 'TextNode') {
              srcValue = srcAttr.value.chars;
            } else {
              srcValue = srcAttr.value;
            }
          }

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

              if (normalizedAltValue !== null) {
                if (/^\d+$/g.test(normalizedAltValue)) {
                  this.logNode({
                    message: 'A number is not valid alt text',
                    node,
                  });
                } else {
                  const normalizedAltValueWords = normalizedAltValue.split(' ');
                  const existingWords = REDUNDANT_WORDS.filter((word) =>
                    normalizedAltValueWords.includes(word)
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
          const isImageInput = match(node, {
            attributes: [{ name: 'type', value: { type: 'TextNode', chars: 'image' } }],
          });
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
          const hasRole = AstNodeInfo.hasAttribute(node, 'role');
          let roleAttr, roleValue;
          if (hasRole) {
            roleAttr = AstNodeInfo.findAttribute(node, 'role');
            if (roleAttr.value.type === 'TextNode') {
              roleValue = roleAttr.value.chars;
            } else {
              roleValue = roleAttr.value;
            }
          }
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
}
