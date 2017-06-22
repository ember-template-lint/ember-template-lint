'use strict';

const Rule = require('./base');
const message = 'Unexpected {{debugger}} usage.';

module.exports = class NoDebugger extends Rule {
  _checkForDebugger(node) {
    if (node.path.original === 'debugger') {
      this.log({
        message: message,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node)
      });
    }
  }

  visitors() {
    return {
      MustacheStatement(node) {
        this._checkForDebugger(node);
      },

      BlockStatement(node) {
        this._checkForDebugger(node);
      }
    };
  }
};

module.exports.message = message;
