'use strict';

const buildPlugin = require('./base');
const message = 'The inline form of link-to is not allowed. Use the block form instead.';

module.exports = function(addonContext) {
  return class InlineLinkTo extends buildPlugin(addonContext, 'inline-link-to') {
    visitors() {
      return {
        MustacheStatement(node) {
          if (node.path.original === 'link-to') {
            this.log({
              message: message,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node)
            });
          }
        }
      };
    }
  };
};

module.exports.message = message;
