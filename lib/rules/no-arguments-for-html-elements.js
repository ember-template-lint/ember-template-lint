'use strict';

const Rule = require('./base');
const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');

const ERROR_MESSAGES = {
  1: 'Arguments ("%") should not be used on HTML elements ("<%>").',
  2: 'Block params ("%") should not be used on HTML elements.',
};

function makeError(msgId, ...args) {
  return args.reduce((result, value) => {
    return result.replace('%', value);
  }, ERROR_MESSAGES[msgId]);
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
            message: makeError(1, name, node.tag),
            line: attr.loc && attr.loc.start.line,
            column: attr.loc && attr.loc.start.column,
            source: sourceForNode(attr),
          });
        }
      });
      node.blockParams.forEach((param) => {
        log({
          message: makeError(2, param),
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: sourceForNode(node),
        });
      });
    }

    return {
      ElementNode: (node) => {
        if (looksLikeHTMLElement(this.scope, node)) {
          detectInvalidAttributes(node);
        }
      },
    };
  }
};
module.exports.makeError = makeError;
