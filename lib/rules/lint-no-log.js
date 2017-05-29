'use strict';

const buildPlugin = require('./base');
const message = 'Unexpected {{log}} usage.';

module.exports = function(addonContext) {
  return class NoLog extends buildPlugin(addonContext, 'no-log') {
    _checkForLog(node) {
      if (node.path.original === 'log') {
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
          this._checkForLog(node);
        },

        BlockStatement(node) {
          this._checkForLog(node);
        }
      };
    }
  };
};

module.exports.message = message;
