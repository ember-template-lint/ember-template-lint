'use strict';

var AstNodeInfo = require('../helpers/ast-node-info');
var buildPlugin = require('./base');

/**
 Disallow usage of `<img>` without an `alt` attribute.

 Good:

 ```
 <img alt="some stuff">
 ```

 Bad:

 ```
 <img>
 ```
 */
module.exports = function(addonContext) {
  var ImgAltAttributes = buildPlugin(addonContext, 'img-alt-attributes');

  ImgAltAttributes.prototype.visitors = function() {
    return {
      ElementNode: function(node) {
        var isImg = AstNodeInfo.isImgElement(node);
        if (!isImg) { return; }

        var ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');
        var altPresent = isAltPresent(node);

        if (!ariaHidden && !altPresent) {
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


function isAltPresent(node) {
  var altAttribute = AstNodeInfo.findAttribute(node, 'alt');

  return !!altAttribute;
}
