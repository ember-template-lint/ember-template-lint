'use strict';

const Rule = require('./base');

const message = 'Unexpected block usage. The {{input}} helper may only be used inline.';

module.exports = class NoInputBlock extends Rule {
  static get meta() {
    return {
      description: 'disallows the block for of the `input` helper',
      category: 'Possible Error', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: { recommended: true },
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-input-block.md',
      fixable: false,
    };
  }
  _checkForInput(node) {
    if (node.path.original === 'input') {
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
      BlockStatement(node) {
        this._checkForInput(node);
      },
    };
  }
};

module.exports.message = message;
