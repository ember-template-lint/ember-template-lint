'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Argument "%" won\'t work for HTML elements ("<%>").';
const ERROR_MESSAGE_2 = 'Attribute value "%" won\'t work as expected, you need to wrap it as "%".';
const ERROR_MESSAGE_3 = 'Block param "%" won\'t work for HTML element.';

module.exports = class NoAction extends Rule {
  visitor() {
    const isLocal = this.isLocal.bind(this);
    const log = this.log.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);

    function looksLikeHTMLElement(node) {
      if (isLocal(node)) {
        return false;
      }
      const tagName = node.tag;
      if (tagName.startsWith('@') || tagName.startsWith(':') || tagName.includes('.')) {
        return false;
      }
      return tagName.charAt(0) === tagName.charAt(0).toLowerCase();
    }

    function detectInvalidAttributes(node) {
      node.attributes.forEach(attr => {
        const name = attr.name;
        const value = attr.value;
        if (attr.name.startsWith('@')) {
          log({
            message: ERROR_MESSAGE.replace('%', name).replace('%', node.tag),
            line: attr.loc && attr.loc.start.line,
            column: attr.loc && attr.loc.start.column,
            source: sourceForNode(attr),
          });
        } else if (
          value.type === 'TextNode' &&
          (value.chars.startsWith('@') || value.chars.startsWith('this.'))
        ) {
          log({
            message: ERROR_MESSAGE_2.replace('%', `${value.chars}`).replace(
              '%',
              `${name}={{${value.chars}}}`
            ),
            line: value.loc && value.loc.start.line,
            column: value.loc && value.loc.start.column,
            source: sourceForNode(value),
          });
        }
      });

      node.blockParams.forEach(param => {
        log({
          message: ERROR_MESSAGE_3.replace('%', param),
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: sourceForNode(node),
        });
      });
    }

    return {
      ElementNode: node => {
        if (looksLikeHTMLElement(node)) {
          detectInvalidAttributes(node);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
module.exports.ERROR_MESSAGE_2 = ERROR_MESSAGE_2;
module.exports.ERROR_MESSAGE_3 = ERROR_MESSAGE_3;
