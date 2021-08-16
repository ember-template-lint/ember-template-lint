'use strict';

const Rule = require('./_base');

const message = 'Unexpected {{debugger}} usage.';
const ruleMeta = {
  description: 'disallows `{{debugger}}` in templates',
  category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
  presets: {},
  url: 'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-debugger.md',
  fixable: false,
};

module.exports = class NoDebugger extends Rule {
  static get meta() {
    return ruleMeta;
  }
  _checkForDebugger(node) {
    if (node.path.original === 'debugger') {
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
        this._checkForDebugger(node);
      },

      BlockStatement(node) {
        this._checkForDebugger(node);
      },
    };
  }
};

module.exports.message = message;
module.exports.ruleMeta = ruleMeta;
