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
 */

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var buildPlugin = require('./base');
var astInfo = require('../helpers/ast-node-info');

var GLOBAL_ATTRIBUTES = [
  'title'
];

var TAG_ATTRIBUTES = {
  'input': [ 'placeholder' ],
  'img': [ 'alt' ]
};

module.exports = function(addonContext) {
  var LogStaticStrings = buildPlugin(addonContext, 'bare-strings');

  LogStaticStrings.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The bare-strings rule accepts one of the following values.\n ' +
          '  * boolean - `true` to enable / `false` to disable\n' +
          '  * array -- an array of strings to whitelist\n' +
          '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      return config;
    case 'object':
      if (Array.isArray(config)) {
        return config;
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
    var additionalDescription = 'in `' + attributeType + '` attribute ';
    var isGlobalAttribute = GLOBAL_ATTRIBUTES.indexOf(attributeType) > -1;
    var isElementAttribute = TAG_ATTRIBUTES[tag] && TAG_ATTRIBUTES[tag].indexOf(attributeType) > -1;

    if (astInfo.isTextNode(attributeValueNode) && (isGlobalAttribute || isElementAttribute)) {
      this._checkNodeAndLog(attributeValueNode, additionalDescription, attribute.loc);
    }
  };

  LogStaticStrings.prototype._getBareString = function(string) {
    var whitelist = Array.isArray(this.config) ? this.config : null;

    if (whitelist) {
      for (var i = 0; i < whitelist.length; i++) {
        var entry = whitelist[i];

        while (string.indexOf(entry) > -1) {
          string = string.replace(entry, '');
        }
      }
    }

    return string.trim() !== '' ? string : null;
  };

  LogStaticStrings.prototype._checkNodeAndLog = function(node, additionalDescription, loc) {
    var bareStringText = this._getBareString(node.chars);

    if (bareStringText) {
      var locationDisplay = calculateLocationDisplay(this.options.moduleName, loc && loc.start);
      var warning = 'Non-translated string used ' + additionalDescription + locationDisplay + ': `' + bareStringText + '`.';

      this.log(warning);
    }
  };

  LogStaticStrings.prototype.detect = function(node) {
    return astInfo.isElementNode(node) || astInfo.isTextNode(node);
  };

  return LogStaticStrings;
};
