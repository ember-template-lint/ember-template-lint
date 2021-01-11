'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'A `<button>` with `type="submit"` should have no action';

module.exports = class NoActionOnSubmitButton extends Rule {
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
        let { tag, attributes, modifiers } = node;

        if (tag !== 'button') {
          return;
        }

        function isTypeAttribe(attribute) {
          return attribute.name === 'type';
        }

        function isActionModifier(modifier) {
          let { path, params } = modifier;
          return path.original === 'action' && params[0].type === 'PathExpression';
        }

        function isOnClickModifier(modifier) {
          let { path, params } = modifier;

          return (
            path.original === 'on' &&
            params[0].value === 'click' &&
            params[1].type === 'PathExpression'
          );
        }

        let typeAttribute = attributes.find((it) => isTypeAttribe(it));
        let onClickModifier = modifiers.find((it) => isOnClickModifier(it));
        let actionModifier = modifiers.find((it) => isActionModifier(it));

        // undefined type fallbacks on "submit"
        if (!typeAttribute) {
          if (actionModifier || onClickModifier) {
            return this.logNode({ node, message: ERROR_MESSAGE });
          }
          return;
        }

        let { type, chars } = typeAttribute.value;

        if (type !== 'TextNode') {
          return;
        }

        if (chars === 'submit') {
          if (actionModifier || onClickModifier) {
            return this.logNode({ node, message: ERROR_MESSAGE });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
