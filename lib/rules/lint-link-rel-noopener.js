'use strict';

var AstNodeInfo = require('../helpers/ast-node-info');
var buildPlugin = require('./base');

/**
 Disallow usage of `<a taget="_blank">` without an `rel="noopener"` attribute.

 Good:

 ```
 <a href="/some/where" target="_blank" rel="noopener"></a>
 ```

 Bad:

 ```
 <a href="/some/where" target="_blank"></a>
 ```
 */
module.exports = function(addonContext) {
  var LinkRelNoopener = buildPlugin(addonContext, 'link-rel-noopener');

  LinkRelNoopener.prototype.visitors = function() {
    return {
      ElementNode: function(node) {
        var isLink = AstNodeInfo.isLinkElement(node);
        if (!isLink) { return; }

        var targetBlank = hasTargetBlank(node);
        if (!targetBlank) { return; }

        var relNoopener = hasRelNoopener(node);
        if (relNoopener) { return; }

        this.log({
          message: 'links with target="_blank" must have rel="noopener"',
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node)
        });
      }
    };
  };

  return LinkRelNoopener;
};


function hasTargetBlank(node) {
  var targetAttribute = AstNodeInfo.findAttribute(node, 'target');
  if (!targetAttribute) { return false; }

  switch (targetAttribute.value.type) {
  case 'TextNode':
    return targetAttribute.value.chars === '_blank';
  default:
    return false;
  }
}

function hasRelNoopener(node) {
  var relAttribute = AstNodeInfo.findAttribute(node, 'rel');
  if (!relAttribute) { return false; }

  switch (relAttribute.value.type) {
  case 'TextNode':
    return relAttribute.value.chars === 'noopener';
  default:
    return false;
  }
}