'use strict';

var AstNodeInfo = require('../helpers/ast-node-info');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var StyleConcat = buildPlugin(addonContext, 'style-concatenation');

  StyleConcat.prototype.visitors = function() {
    return {
      ElementNode: function(node) {
        var style = AstNodeInfo.findAttribute(node, 'style');
        if (style && style.value.type === 'ConcatStatement') {
          this.log({
            message: 'You may not use string concatenation to build up styles',
            line: style.loc && style.loc.start.line,
            column: style.loc && style.loc.start.column,
            source: this.sourceForNode(style)
          });
        }
      }
    };
  };

  return StyleConcat;
};
