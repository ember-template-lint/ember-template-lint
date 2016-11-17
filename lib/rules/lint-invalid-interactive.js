'use strict';

var buildPlugin = require('./base');
var isInteractiveElement = require('../helpers/is-interactive-element');
var parseConfig = require('../helpers/parse-interactive-element-config');

module.exports = function(addonContext) {
  var InvalidInteractive = buildPlugin(addonContext, 'invalid-interactive');

  InvalidInteractive.prototype.parseConfig = function(config) {
    return parseConfig(this.ruleName, config);
  };

  InvalidInteractive.prototype.isCustomInteractiveElement = function(node) {
    var additionalInteractiveTags = this.config.additionalInteractiveTags || [];

    if (additionalInteractiveTags.indexOf(node.tag) > -1) {
      return true;
    } else {
      return false;
    }
  };

  InvalidInteractive.prototype.visitors = function() {
    this._element = null;

    var visitor = {
      enter: function(node) {
        var isInteractive = isInteractiveElement(node) || this.isCustomInteractiveElement(node);
        this._element = !isInteractive ? node : null;
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
          // Allow {{action "foo" on="submit"}} on form tags
          if (this._element.tag === 'form' && isSubmitAction(node)) {
            return;
          }

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

function isSubmitAction(node) {
  var hashPairs = node.hash.pairs || [];
  var i;
  var l = hashPairs.length;
  var hashItem;

  for (i = 0; i < l; i++) {
    hashItem = hashPairs[i];
    if (hashItem.key === 'on' && hashItem.value.value === 'submit') {
      return true;
    }
  }

  return false;
}
