'use strict';
const Rule = require('./_base');

const ERROR_MESSAGE = 'Excess whitespace in layout detected.';

const whitespaceCharacterList = new Set([
  '&#32;',
  ' ',
  '&#160;',
  '&nbsp;',
  '&NonBreakingSpace;',
  '&#8194;',
  '&ensp;',
  '&#8195;',
  '&emsp;',
  '&#8196;',
  '&emsp13;',
  '&#8197;',
  '&emsp14;',
  '&#8199;',
  '&numsp;',
  '&#8200;',
  '&puncsp;',
  '&#8201;',
  '&thinsp;',
  '&ThinSpace;',
  '&#8202;',
  '&hairsp;',
  '&VeryThinSpace;',
  '&ThickSpace;',
  '&#8203;',
  '&ZeroWidthSpace;',
  '&NegativeVeryThinSpace;',
  '&NegativeThinSpace;',
  '&NegativeMediumSpace;',
  '&NegativeThickSpace;',
  '&#8204;',
  '&zwnj;',
  '&#8205;',
  '&zwj;',
  '&#8206;',
  '&lrm;',
  '&#8207;',
  '&rlm;',
  '&#8287;',
  '&MediumSpace;',
  '&ThickSpace;',
  '&#8288;',
  '&NoBreak;',
  '&#8289;',
  '&ApplyFunction;',
  '&af;',
  '&#8290;',
  '&InvisibleTimes;',
  '&it;',
  '&#8291;',
  '&InvisibleComma;',
  '&ic;',
]);

function isWhitespace(char) {
  return whitespaceCharacterList.has(char);
}

function splitTextByEntity(input) {
  let result = [];

  for (let i = 0; i < input.length; i++) {
    let current = input[i];

    if (current === '&') {
      let possibleEndIndex = input.indexOf(';', i);

      // this is a stand alone `&`
      if (possibleEndIndex === -1) {
        result.push(current);
      }

      // now we know we have an "entity like thing"
      let possibleEntity = input.slice(i, possibleEndIndex + 1);
      if (whitespaceCharacterList.has(possibleEntity)) {
        result.push(possibleEntity);
        i += possibleEntity.length - 1;
      } else {
        result.push(current);
      }
    } else {
      result.push(current);
    }
  }

  return result;
}

// The goal here is to catch alternating non-whitespace/whitespace
// characters, for example, in 'W e l c o m e'.
//
// So the final pattern boils down to this:
//
// (whitespace)(non-whitespace)(whitespace)(non-whitespace)(whitespace)
//
// Specifically using this "5 alternations" rule since any less than this
// will return false positives and any more than this should not be
// necessary in 99.99% of cases
module.exports = class NoWhitespaceWithinWord extends Rule {
  visitor() {
    return {
      TextNode(node, path) {
        let parents = [...path.parents()];
        if (
          parents.some((parent) => parent.node.type === 'AttrNode') ||
          parents.some(
            (parent) => parent.node.type === 'ElementNode' && parent.node.tag === 'style'
          )
        ) {
          return;
        }
        let alternationCount = 0;
        let source = this.sourceForNode(node);
        let characters = splitTextByEntity(source);

        for (let i = 0; i < characters.length; i++) {
          let currentChar = characters[i];
          let previousChar = i > 0 ? characters[i - 1] : undefined;

          if (
            (isWhitespace(currentChar) && !isWhitespace(previousChar)) ||
            (!isWhitespace(currentChar) && isWhitespace(previousChar))
          ) {
            alternationCount++;
          } else {
            alternationCount = 0;
          }

          if (alternationCount >= 5) {
            this.log({
              message: ERROR_MESSAGE,
              node,
              source,
            });

            // no need to keep parsing, we've already reported
            return;
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
