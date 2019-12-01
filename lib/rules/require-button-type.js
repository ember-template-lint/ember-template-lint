'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'All `<button>` elements should have a valid `type` attribute';

module.exports = class RequireButtonType extends Rule {
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
      ElementNode(node) {
        let { tag, attributes } = node;

        if (tag !== 'button') {
          return;
        }

        let typeAttribute = attributes.find(it => it.name === 'type');
        if (!typeAttribute) {
          return this.logNode({ node, message: ERROR_MESSAGE });
        }

        let { value } = typeAttribute;
        if (value.type !== 'TextNode') {
          return;
        }

        let { chars } = value;
        if (!['button', 'submit', 'reset'].includes(chars)) {
          return this.logNode({ node, message: ERROR_MESSAGE });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
