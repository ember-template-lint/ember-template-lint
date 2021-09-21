'use strict';

const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');
const Rule = require('./_base');

function makeError(attrName, tagName) {
  return `Arguments (${attrName}) should not be used on HTML elements (<${tagName}>).`;
}

module.exports = class NoArgumentsForHTMLElements extends Rule {
  visitor() {
    function looksLikeHTMLElement(scope, node) {
      const isComponent = isAngleBracketComponent(scope, node);
      const isSlot = node.tag.startsWith(':');
      const isPath = node.tag.includes('.');
      return !isComponent && !isSlot && !isPath;
    }

    return {
      ElementNode(node) {
        if (looksLikeHTMLElement(this.scope, node)) {
          for (const attr of node.attributes) {
            const { name } = attr;
            if (name.startsWith('@')) {
              this.log({
                message: makeError(name, node.tag),
                node: attr,
              });
            }
          }
        }
      },
    };
  }
};

module.exports.makeError = makeError;
