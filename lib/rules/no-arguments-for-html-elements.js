'use strict';

const Rule = require('./base');
const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');

function makeError(attrName, tagName) {
  return `Arguments (${attrName}) should not be used on HTML elements (<${tagName}>).`;
}

module.exports = class NoArgumentsForHTMLElements extends Rule {
  visitor() {
    const log = this.log.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);

    function looksLikeHTMLElement(scope, node) {
      const isComponent = isAngleBracketComponent(scope, node);
      const isSlot = node.tag.startsWith(':');
      const isPath = node.tag.includes('.');
      return !isComponent && !isSlot && !isPath;
    }

    function detectInvalidAttributes(node) {
      node.attributes.forEach((attr) => {
        const name = attr.name;
        if (attr.name.startsWith('@')) {
          log({
            message: makeError(name, node.tag),
            line: attr.loc && attr.loc.start.line,
            column: attr.loc && attr.loc.start.column,
            source: sourceForNode(attr),
          });
        }
      });
    }

    return {
      ElementNode(node) {
        if (looksLikeHTMLElement(this.scope, node)) {
          detectInvalidAttributes(node);
        }
      },
    };
  }
};

module.exports.makeError = makeError;
