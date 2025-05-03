import Rule from './_base.js';

const message = 'Unexpected `tagName` usage on {{input}} helper.';

function firstComponentParamIsInput(node) {
  return (
    node && Array.isArray(node.params) && node.params[0] && node.params[0].original === 'input'
  );
}

function hasTagNameAttr(attrs) {
  for (const attr of attrs) {
    if (attr.key === 'tagName') {
      return true;
    }
  }

  return false;
}

export default class NoInputTagname extends Rule {
  _checkForInputTagName(node) {
    let attrs = (node.hash || {}).pairs || [];

    if (node.path.original === 'input' && hasTagNameAttr(attrs)) {
      this.log({
        message,
        node,
      });
    } else if (
      node.path.original === 'component' &&
      firstComponentParamIsInput(node) &&
      hasTagNameAttr(attrs)
    ) {
      this.log({
        message,
        node,
      });
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForInputTagName(node);
      },

      SubExpression(node) {
        this._checkForInputTagName(node);
      },
    };
  }
}
