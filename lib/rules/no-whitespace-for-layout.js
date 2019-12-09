'use strict';
const Rule = require('./base');

const ERROR_MESSAGE = 'Excess whitespace detected.';

module.exports = class NoWhitespaceForLayout extends Rule {
  static get meta() {
    return {
      description: 'disallows use of unused whitespace for layout formatting',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-whitespace-for-layout.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      TextNode(node) {
        let source = this.sourceForNode(node);
        // check for two ` ` or `&nbsp;` in a row
        let matches = source.match(/(( )|(&nbsp;))(( )|(&nbsp;))/g);
        if (matches !== null) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
