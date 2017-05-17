'use strict';

const buildPlugin = require('./base');
const message = 'The inline form of link-to is not allowed. Use the block form instead.';

module.exports = function(addonContext) {
  let InlineLinkTo = buildPlugin(addonContext, 'inline-link-to');

  InlineLinkTo.prototype.visitors = function() {
    return {
      MustacheStatement: function(node) {
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
  };

  return InlineLinkTo;
};

module.exports.message = message;
