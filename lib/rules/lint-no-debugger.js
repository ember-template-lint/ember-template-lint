'use strict';

const buildPlugin = require('./base');
const message = 'Unexpected {{debugger}} usage.';

module.exports = function(addonContext) {
  return class NoDebugger extends buildPlugin(addonContext, 'no-debugger') {
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
};

module.exports.message = message;
