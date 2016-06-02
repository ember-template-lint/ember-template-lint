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
var parseConfig = require('../helpers/parse-interactive-element-config');

var ARRAY_DEPRECATION_MESSAGE = 'Specifying an array as the configurate for the `nested-interactive` rule is deprecated and will be removed in future versions.  Please update `.template-lintrc.js` to use the newer object format.';

function convertConfigArrayToObject(config) {
  var base = {
    ignoredTags: [],
    ignoreTabindex: false,
    ignoreUsemapAttribute: false
  };

  for (var i = 0; i < config.length; i++) {
    var value = config[i];

    switch (value) {
    case 'tabindex':
      base.ignoreTabindex = true;
      break;
    case 'usemap':
      base.ignoreUsemapAttribute = true;
      break;
    default:
      base.ignoredTags.push(value);
    }
  }

  return base;
}

module.exports = function(addonContext) {
  var LogNestedInteractive = buildPlugin(addonContext, 'nested-interactive');

  LogNestedInteractive.prototype.parseConfig = function(config) {
    if (Array.isArray(config)) {
      return convertConfigArrayToObject(config);
    }

    return parseConfig(this.ruleName, config);
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

    var visitor = {
      enter: function(node) {
        var isInteractive = isInteractiveElement(node);

        if (this.isCustomInteractiveElement(node)) {
          isInteractive = true;
        }

        if (!isInteractive) { return; }
        if (this.isInteractiveExcluded(node)) { return; }

        if (this.hasLabelParentNode()) {
          if (this._seenInteractiveChild) {
            this.log({
              message: 'Do not use multiple interactive elements inside a single `<label>`',
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(this._parentInteractiveNode)
            });
          } else {
            this._seenInteractiveChild = true;
          }
        } else if (this.hasParentNode()) {
          this.log({
            message: this.getLogMessage(node, this._parentInteractiveNode),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node)
          });
        } else if (this.isInteractiveFromTabindex(node)) {
          // do not consider a thing a "parent interactive node" for
          // tabindex alone
          return;
        } else {
          this._parentInteractiveNode = node;
        }
      },

      exit: function(node) {
        if (this._parentInteractiveNode === node) {
          this._parentInteractiveNode = null;
          this._seenInteractiveChild = false;
        }
      }
    };

    return {
      ElementNode: visitor,
      ComponentNode: visitor
    };
  };

  LogNestedInteractive.prototype.hasLabelParentNode = function() {
    return this._parentInteractiveNode && this._parentInteractiveNode.tag === 'label';
  };

  LogNestedInteractive.prototype.hasParentNode = function() {
    return this._parentInteractiveNode;
  };

  LogNestedInteractive.prototype.isCustomInteractiveElement = function(node) {

    var additionalInteractiveTags = this.config.additionalInteractiveTags || [];

    if (additionalInteractiveTags.indexOf(node.tag) > -1) {
      return true;
    } else {
      return false;
    }
  };

  LogNestedInteractive.prototype.isInteractiveFromTabindex = function(node) {
    var reason = isInteractiveElement.reason(node);

    if (reason && reason.indexOf('tabindex') > -1) {
      return true;
    } else {
      return false;
    }
  };

  LogNestedInteractive.prototype.isInteractiveExcluded = function(node) {
    var reason = isInteractiveElement.reason(node);
    var ignoredTags = this.config.ignoredTags || [];
    var ignoreTabindex = this.config.ignoreTabindex;
    var ignoreUsemapAttribute = this.config.ignoreUsemapAttribute;

    if (ignoredTags.indexOf(node.tag) > -1) {
      return true;
    }

    if (ignoreTabindex && reason.indexOf('tabindex') > -1) {
      return true;
    }

    if (ignoreUsemapAttribute && reason.indexOf('usemap') > -1) {
      return true;
    }
  };

  LogNestedInteractive.prototype.getLogMessage = function(node, parentNode) {
    var parentReason = isInteractiveElement.reason(parentNode);
    var childReason = isInteractiveElement.reason(node);

    // `reason` for `additionalInteractiveTags` would be `null`
    // so we need to handle that and update the reason correctly
    if (this.isCustomInteractiveElement(parentNode)) {
      parentReason = '<' + parentNode.tag + '>';
    }

    if (this.isCustomInteractiveElement(node)) {
      childReason = '<' + node.tag + '>';
    }

    return 'Do not use ' + childReason + ' inside ' + parentReason;
  };

  return LogNestedInteractive;
};

module.exports.ARRAY_DEPRECATION_MESSAGE = ARRAY_DEPRECATION_MESSAGE;
