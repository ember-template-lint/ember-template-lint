'use strict';

const Rule = require('./base');

module.exports = class NoUnnecessaryConcat extends Rule {
  static get meta() {
    return {
      description: 'disallows use of quotes around expressions in curly braces',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-unnecessary-concat.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      ConcatStatement(node) {
        if (node.parts.length === 1) {
          let source = this.sourceForNode(node);
          let innerSource = this.sourceForNode(node.parts[0]);
          let message = `Unnecessary string concatenation. Use ${innerSource} instead of ${source}.`;

          this.log({
            message,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source,
          });
        }
      },
    };
  }
};
