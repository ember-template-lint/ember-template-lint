'use strict';

const Rule = require('./base');

const ERROR_MESSAGE =
  'HTML elements do not support named arguments and will prevent your page from rendering.';

function getArgumentNodes(node) {
  const attributes = node.attributes || [];
  return attributes.filter((attribute) => attribute.name.startsWith('@'));
}

function isHtmlNode(node) {
  return node.tag === node.tag.toLowerCase();
}

module.exports = class NoElementArgs extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (!isHtmlNode(node)) {
          return;
        }

        const argumentNodes = getArgumentNodes(node);
        if (argumentNodes.length > 0) {
          argumentNodes.forEach((argumentNode) =>
            this.log({
              message: ERROR_MESSAGE,
              line: argumentNode.loc && argumentNode.loc.start.line,
              column: argumentNode.loc && argumentNode.loc.start.column,
              source: this.sourceForNode(argumentNode),
            })
          );
        }
      },
    };
  }
};
module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
