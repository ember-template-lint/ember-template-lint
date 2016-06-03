'use strict';

var buildPlugin = require('./base');
var isInteractiveElement = require('../helpers/is-interactive-element');
var parseConfig = require('../helpers/parse-interactive-element-config');

module.exports = function(addonContext) {
  var InvalidInteractive = buildPlugin(addonContext, 'invalid-interactive');

  InvalidInteractive.prototype.parseConfig = function(config) {
    return parseConfig(this.ruleName, config);
  };

  InvalidInteractive.prototype.visitors = function() {
    this._element = null;

    var visitor = {
      enter: function(node) {
        if (!isInteractiveElement(node)) {
          this._element = node;
        }
      },

      exit: function(node) {
        if (this._element === node) {
          this._element = null;
        }
      }
    };

    return {
      ElementModifierStatement: function(node) {
        if (!this._element) { return; }

        var modifierName = node.path.original;

        if (modifierName === 'action') {
          this.log({
            message: 'Interaction added to non-interactive element',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(this._element)
          });
        }
      },

      AttrNode: function(node) {
        if (!this._element) { return; }

        if (node.value.type !== 'MustacheStatement') {
          return;
        }

        var helperName = node.value.path.original;

        if (helperName === 'action') {
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
