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

var ARRAY_DEPRECATION_MESSAGE = 'Specifying an array as the configurate for the `nested-interactive` rule is deprecated and will be removed in future versions.  Please update `.template-lintrc.js` to use the newer object format.';

function configValid(config) {
  for (var key in config) {
    var value = config[key];

    switch (key) {
    case 'ignoredTags':
    case 'additionalInteractiveTags':
      if (!Array.isArray(value)) {
        return false;
      }
      break;
    case 'ignoreTabindex':
    case 'ignoreUsemapAttribute':
      if (typeof value !== 'boolean') {
        return false;
      }
      break;
    default:
      return false;
    }
  }

  return true;
}

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
    var configType = typeof config;

    var errorMessage = [
      'The nested-interactive rule accepts one of the following values.',
      '  * boolean - `true` to enable / `false` to disable',
      '  * object - Containing the following values:',
      '    * `ignoredTags` - An array of element tag names that should be whitelisted. Default to `[]`.',
      '    * `ignoreTabindex` - When `true` tabindex will be ignored. Defaults to `false`.',
      '    * `ignoreUsemapAttribute` - When `true` ignores the `usemap` attribute on `img` and `object` elements. Defaults `false`.',
      '    * `additionalInteractiveTags` - An array of element tag names that should also be considered as interactive. Defaults to `[]`.',
      'You specified `' + JSON.stringify(config) + '`'
    ].join('\n');

    switch (configType) {
    case 'boolean':
      return config;
    case 'object':
      if (configValid(config)) {
        return config;
      } else if (Array.isArray(config)) {
        this.log({
          message: ARRAY_DEPRECATION_MESSAGE,
          source: JSON.stringify(config),
          severity: 1
        });
        return convertConfigArrayToObject(config);
      } else {
        throw new Error(errorMessage);
      }
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

    var visitor = {
      enter: function(node) {
        var isInteractive = isInteractiveElement(node);

        if (this.isCustomInteractiveElement(node)) {
          isInteractive = true;
        }

        if (!isInteractive) { return; }
        if (this.isInteractiveExcluded(node)) { return; }

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
    };

    return {
      ElementNode: visitor,
      ComponentNode: visitor
    };
  };

  LogNestedInteractive.prototype.isCustomInteractiveElement = function(node) {

    var additionalInteractiveTags = this.config.additionalInteractiveTags || [];

    if (additionalInteractiveTags.indexOf(node.tag) > -1) {
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
