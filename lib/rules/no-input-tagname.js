'use strict';

const Rule = require('./base');

const message = 'Unexpected `tagName` usage on {{input}} helper.';

function firstComponentParamIsInput(node) {
  return (
    node && Array.isArray(node.params) && node.params[0] && node.params[0].original === 'input'
  );
}

function hasTagNameAttr(attrs) {
  for (let i = 0; i < attrs.length; i++) {
    if (attrs[i].key === 'tagName') {
      return true;
    }
  }

  return false;
}

module.exports = class NoInputTagname extends Rule {
  static get meta() {
    return {
      description: 'disallows `tagName` on the `input` element',
      category: 'Possible Error', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-input-tagname.md',
      fixable: false,
    };
  }
  _checkForInputTagName(node) {
    let attrs = (node.hash || {}).pairs || [];

    if (node.path.original === 'input' && hasTagNameAttr(attrs)) {
      this.log({
        message,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
    } else if (
      node.path.original === 'component' &&
      firstComponentParamIsInput(node) &&
      hasTagNameAttr(attrs)
    ) {
      this.log({
        message,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
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
};

module.exports.message = message;
