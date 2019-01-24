'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const REDUNDANT_WORDS = ['image', 'photo', 'picture'];

const errorMessage =
  'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt attribute.';

module.exports = class ImgRedundantAlt extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const isImg = AstNodeInfo.isImgElement(node);
        if (!isImg) {
          return;
        }
        const ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');
        if (ariaHidden) {
          return;
        }
        const altAttribute = AstNodeInfo.findAttribute(node, 'alt');
        if (!altAttribute) {
          return;
        }

        if (altAttribute.value) {
          let normalizedAltValue = '';
          if (altAttribute.value.type === 'TextNode') {
            normalizedAltValue = altAttribute.value.chars.trim().toLowerCase();
          } else if (altAttribute.value.type === 'ConcatStatement') {
            normalizedAltValue = altAttribute.value.parts
              .filter(part => part.type === 'TextNode')
              .map(part => part.chars)
              .join(' ')
              .trim()
              .toLowerCase();
          }
          const existingWords = REDUNDANT_WORDS.filter(
            word => normalizedAltValue.indexOf(word) !== -1
          );
          if (existingWords.length) {
            this.log({
              message: errorMessage,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
    };
  }
};
