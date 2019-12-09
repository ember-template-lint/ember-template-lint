'use strict';

const Rule = require('./base');

const ERROR_MESSAGES = {
  1: 'Arguments ("%") should not be used on HTML elements ("<%>").',
  2: 'Attribute value "%" won\'t work as expected, you need to wrap it as "%".',
  3: 'Block param "%" won\'t work for HTML element.',
};

function makeError(msgId, ...args) {
  return args.reduce((result, value) => {
    return result.replace('%', value);
  }, ERROR_MESSAGES[msgId]);
}
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

    function detectInvalidArgumentValues(attr) {
      const name = attr.name;
      const value = attr.value;
      const originalNode = sourceForNode(value);
      const safeValues = ['`', "'", '"'].reduce((result, wrapper) => {
        result.push(wrapper + value.chars + wrapper);
        return result;
      }, []);
      if (!safeValues.includes(originalNode)) {
        log({
          message: makeError(2, `${value.chars}`, `${name}={{${value.chars}}}`),
          line: value.loc && value.loc.start.line,
          column: value.loc && value.loc.start.column,
          source: sourceForNode(value),
        });
      }
    }

    function mayContainInvalidArgument(attrValue) {
      return (
        attrValue.type === 'TextNode' &&
        (attrValue.chars.startsWith('@') || attrValue.chars.startsWith('this.'))
      );
    }

    function detectInvalidComponentAttributeValues(node) {
      node.attributes.forEach(attr => {
        if (mayContainInvalidArgument(attr.value)) {
          detectInvalidArgumentValues(attr);
        }
      });
    }

    function detectInvalidAttributes(node) {
      node.attributes.forEach(attr => {
        const name = attr.name;
        const value = attr.value;
        if (attr.name.startsWith('@')) {
          log({
            message: makeError(1, name, node.tag),
            line: attr.loc && attr.loc.start.line,
            column: attr.loc && attr.loc.start.column,
            source: sourceForNode(attr),
          });
        } else if (mayContainInvalidArgument(value)) {
          detectInvalidArgumentValues(attr);
        }
      });

      node.blockParams.forEach(param => {
        log({
          message: makeError(3, param),
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
        } else {
          detectInvalidComponentAttributeValues(node);
        }
      },
    };
  }
};
module.exports.makeError = makeError;
