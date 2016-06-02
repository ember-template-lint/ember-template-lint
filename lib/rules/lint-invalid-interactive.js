'use strict';

var buildPlugin = require('./base');
var isInteractiveElement = require('../helpers/is-interactive-element');
var parseConfig = require('../helpers/parse-interactive-element-config');
var AstNodeInfo = require('../helpers/ast-node-info');

module.exports = function(addonContext) {
  var InvalidInteractive = buildPlugin(addonContext, 'invalid-interactive');

  InvalidInteractive.prototype.parseConfig = function(config) {
    return parseConfig(this.ruleName, config);
  };

  InvalidInteractive.prototype.visitors = function() {
    this._element = null;

    var visitor = {
      enter: function(node) {
        this._element = node;
      },

      exit: function(node) {
        if (this._element === node) {
          this._element = null;
        }
      }
    };

    return {
      ElementModifierStatement: function(node) {
        var isInteractive = isInteractiveElement(this._element);
        var modifierName = node.path.original;
        var hasRole = AstNodeInfo.hasAttribute(this._element, 'role');

        if (modifierName === 'action' && !isInteractive && !hasRole) {
          this.log({
            message: 'Interaction added to non-interactive element',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(this._element)
          });
        }
      },

      ElementNode: visitor,
      ComponentNode: visitor
    };
  };

  return InvalidInteractive;
};
