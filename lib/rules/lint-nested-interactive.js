'use strict';

/*
 Disallows nested of interactive elements

 ```
 {{! good }}
 <button>Click here</button> <a href="/">and a link</a>

 {{! bad}}
 <button>Click here <a href="/">and a link</a></button>
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
 */

var buildPlugin = require('./base');
var isInteractiveElement = require('../helpers/is-interactive-element');

module.exports = function(addonContext) {
  var LogNestedInteractive = buildPlugin(addonContext, 'nested-interactive');

  LogNestedInteractive.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The nested-interactive rule accepts one of the following values.\n ' +
          '  * boolean - `true` to enable / `false` to disable\n' +
          '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      return config;
    case 'object':
      throw new Error(errorMessage);
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  };

  LogNestedInteractive.prototype.getConfigWhiteList = function() {
    if (Array.isArray(this.config)) {
      return this.config;
    } else {
      return [];
    }
  };

  LogNestedInteractive.prototype.visitors = function() {
    this._parentInteractiveNode = null;

    return {
      ElementNode: {
        enter: function(node) {
          if (this.isDisabled()) { return; }

          var isInteractive = isInteractiveElement(node);

          if (!isInteractive) { return; }

          if (this._parentInteractiveNode) {
            this.log({
              message: this.getLogMessage(node, this._parentInteractiveNode),
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node)
            });
          } else {
            this._parentInteractiveNode = node;
          }
        },

        exit: function(node) {
          if (this._parentInteractiveNode === node) {
            this._parentInteractiveNode = null;
          }
        }
      }
    };
  };

  LogNestedInteractive.prototype.getLogMessage = function(node, parentNode) {
    var parentReason = isInteractiveElement.reason(parentNode);
    var childReason = isInteractiveElement.reason(node);

    return 'Do not use ' + childReason + ' inside ' + parentReason;
  };

  return LogNestedInteractive;
};
