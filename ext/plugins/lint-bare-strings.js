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
    var locationDisplay = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);
    var warning = 'Non-translated string used ' + locationDisplay + ' `' + node.chars + '`';

    this.log(warning);
  };

  LogStaticStrings.prototype.detect = function(node) {
    if (node.type !== 'TextNode') { return false;}

    var string = node.chars;
    var whitelist = Array.isArray(this.config) ? this.config : null;

    if (whitelist) {
      for (var i = 0; i < whitelist.length; i++) {
        var entry = whitelist[i];

        string = string.replace(entry, '');
      }
    }

    return string.trim() !== '';
  };

  return LogStaticStrings;
};
