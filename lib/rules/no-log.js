'use strict';

const Rule = require('./base');

const message = 'Unexpected {{log}} usage.';

module.exports = class NoLog extends Rule {
  static get meta() {
    return {
      description: 'disallows `{{log}}` in templates',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-log.md',
      fixable: false,
    };
  }
  _checkForLog(node) {
    if (node.path.original === 'log') {
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
        this._checkForLog(node);
      },

      BlockStatement(node) {
        this._checkForLog(node);
      },
    };
  }
};

module.exports.message = message;
