'use strict';

const Rule = require('./base');

const message = 'The inline form of link-to is not allowed. Use the block form instead.';

module.exports = class InlineLinkTo extends Rule {
  static get meta() {
    return {
      description: 'disallows the inline form of `link-to`',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/inline-link-to.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'link-to') {
          this.log({
            message,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.message = message;
