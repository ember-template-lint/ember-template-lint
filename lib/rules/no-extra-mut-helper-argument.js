'use strict';

const Rule = require('./base');

const ERROR_MESSAGE =
  'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.';

module.exports = class MutSingleArg extends Rule {
  static get meta() {
    return {
      description: 'disallows extra parameters on `mut`',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-extra-mut-helper-argument.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      SubExpression(node) {
        if (node.path.original !== 'mut') {
          return;
        }

        if (node.params.length === 1) {
          // Correct usage.
          return;
        }

        this.log({
          message: ERROR_MESSAGE,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
