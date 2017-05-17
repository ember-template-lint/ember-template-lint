'use strict';


var buildPlugin = require('../../../../lib/rules/base');
var message = 'The inline form of component is not allowed';

module.exports = function(addonContext) {
  return class InlineComponent extends buildPlugin(addonContext, 'inline-component') {
    visitors() {
      return {
        MustacheStatement: function(node) {
          if (node.path.original === 'component') {
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
