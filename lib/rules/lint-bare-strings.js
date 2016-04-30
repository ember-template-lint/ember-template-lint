'use strict';

/*
 Disallows the use of bare strings in a template

 ```
 {{! good }}
 <div>{{evaluatesToAString}}</div>
 <div>{{'A string'}}</div>

 {{! bad}}
 <div>A bare string</div>
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
   * array -- an array of whitelisted strings
   * object -- An object with the following keys:
     * `whitelist` -- An array of whitelisted strings
     * `globalAttributes` -- An array of attributes to check on every element.
     * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name.
 */

var buildPlugin = require('./base');
var astInfo = require('../helpers/ast-node-info');

var GLOBAL_ATTRIBUTES = [
  'title'
];

var TAG_ATTRIBUTES = {
  'input': [ 'placeholder' ],
  'img': [ 'alt' ]
};

var DEFAULT_CONFIG = {
  whitelist: ['(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}'],
  globalAttributes: GLOBAL_ATTRIBUTES,
  elementAttributes: TAG_ATTRIBUTES
};

function isValidConfigObjectFormat(config) {
  for (var key in config) {
    var value = config[key];
    var valueType = typeof value;
    var valueIsArray = Array.isArray(value);

    if (key === 'whitelist' && !valueIsArray) {
      return false;
    } else if (key === 'globalAttributes' && !valueIsArray) {
      return false;
    } else if (key === 'elementAttributes' && valueType === 'object') {
      if (valueIsArray) { return false; }
    } else if (!DEFAULT_CONFIG[key]){
      return false;
    }
  }

  return true;
}

module.exports = function(addonContext) {
  var LogStaticStrings = buildPlugin(addonContext, 'bare-strings');

  LogStaticStrings.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The bare-strings rule accepts one of the following values.\n ' +
          '  * boolean - `true` to enable / `false` to disable\n' +
          '  * array -- an array of strings to whitelist\n' +
          '  * object -- An object with the following keys:' +
          '    * `whitelist` -- An array of whitelisted strings ' +
          '    * `globalAttributes` -- An array of attributes to check on every element.' +
          '    * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name. ' +
          '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      // if `true` use `DEFAULT_CONFIG`
      return config ? DEFAULT_CONFIG : false;
    case 'object':
      if (Array.isArray(config)) {
        return {
          whitelist: config,
          globalAttributes: GLOBAL_ATTRIBUTES,
          elementAttributes: TAG_ATTRIBUTES
        };
      } else if (isValidConfigObjectFormat(config)) {
        // default any missing keys to empty values
        return {
          whitelist: config.whitelist || [],
          globalAttributes: config.globalAttributes || [],
          elementAttributes: config.elementAttributes || {}
        };
      } else {
        throw new Error(errorMessage);
      }
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  };

  LogStaticStrings.prototype.process = function(node) {
    if (astInfo.isTextNode(node)) {
      this._checkNodeAndLog(node, '', node.loc);
    } else if (astInfo.isElementNode(node)){
      var tagName = node.tag;
      for (var i = 0; i < node.attributes.length; i++) {
        this._getBareStringAttribute(tagName, node.attributes[i]);
      }
    }
  };

  LogStaticStrings.prototype._getBareStringAttribute = function(tag, attribute) {
    var attributeType = attribute.name;
    var attributeValueNode = attribute.value;
    var additionalDescription = ' in `' + attributeType + '` attribute';
    var isGlobalAttribute = this.config.globalAttributes.indexOf(attributeType) > -1;
    var isElementAttribute = this.config.elementAttributes[tag] && this.config.elementAttributes[tag].indexOf(attributeType) > -1;

    if (astInfo.isTextNode(attributeValueNode) && (isGlobalAttribute || isElementAttribute)) {
      this._checkNodeAndLog(attributeValueNode, additionalDescription, attribute.loc);
    }
  };

  LogStaticStrings.prototype._getBareString = function(_string) {
    var whitelist = this.config.whitelist;
    var string = _string;

    if (whitelist) {
      for (var i = 0; i < whitelist.length; i++) {
        var entry = whitelist[i];

        while (string.indexOf(entry) > -1) {
          string = string.replace(entry, '');
        }
      }
    }

    return string.trim() !== '' ? _string : null;
  };

  LogStaticStrings.prototype._checkNodeAndLog = function(node, additionalDescription, loc) {
    var bareStringText = this._getBareString(node.chars);

    if (bareStringText) {
      this.log({
        message: 'Non-translated string used' + additionalDescription,
        line: loc.start.line,
        column: loc.start.column,
        source: bareStringText
      });
    }
  };

  LogStaticStrings.prototype.detect = function(node) {
    return astInfo.isElementNode(node) || astInfo.isTextNode(node);
  };

  return LogStaticStrings;
};
