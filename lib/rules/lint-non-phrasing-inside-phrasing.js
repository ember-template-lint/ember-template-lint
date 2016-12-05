'use strict';

var buildPlugin = require('./base');
var isPhrasingContentElement = require('../helpers/is-phrasing-content-element').isPhrasingContentElement;

module.exports = function(addonContext) {
  var Plugin = buildPlugin(addonContext, 'non-phrasing-inside-phrasing');

  Plugin.prototype.visitors = function() {
    var _parentPhrasingContentNodes = [];
    return {
      ElementNode: {
        enter: function(node) {
          if (isPhrasingContentElement(node)) {
            _parentPhrasingContentNodes.push(node);
          } else if(_parentPhrasingContentNodes.length) {
            this.log({
              message: 'non phrasing element was found in phrasing element(s): ' +
                _parentPhrasingContentNodes.map(function(node) { return node.tag; }).join(','),
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node)
            });
          }
        },
        exit: function(node) {
          var index = _parentPhrasingContentNodes.indexOf(node);
          if (index > -1) {
            _parentPhrasingContentNodes.splice(index, 1);
          }
        }
      }
    };
  };

  return Plugin;
};
