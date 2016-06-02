'use strict';

var AstNodeInfo = require('../helpers/ast-node-info');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var ImgAltAttributes = buildPlugin(addonContext, 'img-alt-attributes');

  ImgAltAttributes.prototype.visitors = function() {
    return {
      ElementNode: function(node) {
        var altAttribute = AstNodeInfo.findAttribute(node, 'alt');
        var altPresent = altAttribute && altAttribute.value.chars.length;
        if (AstNodeInfo.isImgElement(node) && !altPresent) {
          this.log({
            message: 'img tags must have an alt attribute',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node)
          });
        }
      }
    };
  };

  return ImgAltAttributes;
};
