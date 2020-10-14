'use strict';

const { builders: b } = require('ember-template-recast');

const Rule = require('./base');

const ERROR_MESSAGE = 'All `<button>` elements should have a valid `type` attribute';

module.exports = class RequireButtonType extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
      isFixable: true,
    });
  }

  visitor() {
    return {
      ElementNode(node) {
        let { tag, attributes } = node;

        if (tag !== 'button') {
          return;
        }

        let typeAttribute = attributes.find((it) => it.name === 'type');
        if (!typeAttribute) {
          if (this.mode === 'fix') {
            attributes.push(b.attr('type', b.text('button')));
          } else {
            this.logNode({ node, message: ERROR_MESSAGE });
          }
          return;
        }

        let { value } = typeAttribute;
        if (value.type !== 'TextNode') {
          return;
        }

        let { chars } = value;
        if (!['button', 'submit', 'reset'].includes(chars)) {
          if (this.mode === 'fix') {
            let index = attributes.indexOf(typeAttribute);
            attributes[index] = b.attr('type', b.text('button'));
          } else {
            this.logNode({ node, message: ERROR_MESSAGE });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
