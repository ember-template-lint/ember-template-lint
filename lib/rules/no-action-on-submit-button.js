import Rule from './_base.js';
import hasParentTag from '../helpers/has-parent-tag.js';

const ERROR_MESSAGE =
  'In a `<form>`, a `<button>` with `type="submit"` should have no click action';

export default class NoActionOnSubmitButton extends Rule {
  logNode({ node, message }) {
    return this.log({
      node,
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }

  visitor() {
    function isTypeAttribute(attribute) {
      return attribute.name === 'type';
    }

    function isOnClickModifier(modifier) {
      let { path, params } = modifier;

      return (
        path.original === 'on' &&
        params.length > 0 &&
        params[0].type === 'StringLiteral' &&
        params[0].value === 'click'
      );
    }

    function isOnClickParameter(parameter) {
      return parameter.key === 'on' && parameter.value.original === 'click';
    }

    function isDisallowedActionModifier(modifier) {
      let { path, hash } = modifier;

      let noParameter = hash.pairs.length === 0;
      let onClickParameter = hash.pairs.find(isOnClickParameter);

      return path.original === 'action' && (noParameter || onClickParameter);
    }

    return {
      ElementNode(node, path) {
        let { tag, attributes, modifiers } = node;

        if (tag !== 'button') {
          return;
        }

        // is this button in a <form>?
        if (!hasParentTag(path, 'form')) {
          return;
        }

        let typeAttribute = attributes.find(isTypeAttribute);
        let onClickModifier = modifiers.find(isOnClickModifier);
        let actionModifier = modifiers.find(isDisallowedActionModifier);

        // undefined button type fallbacks on "submit"
        if (!typeAttribute) {
          if (actionModifier || onClickModifier) {
            return this.logNode({ node, message: ERROR_MESSAGE });
          }
          return;
        }

        let { type, chars } = typeAttribute.value;

        if (type === 'TextNode' && chars === 'submit') {
          if (actionModifier || onClickModifier) {
            return this.logNode({ node, message: ERROR_MESSAGE });
          }
        }
      },
    };
  }
}
