'use strict';

// Disallows the use of bare strings in a template
//
// passes:
// <div>{{evaluatesToAString}}</div>
// <div>{{'A string'}}</div>
//
// breaks:
// <div>A bare string</div>

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var LogStaticStrings = buildPlugin(addonContext, 'bare-strings');

  LogStaticStrings.prototype.process = function(node) {
    var locationDisplay = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);
    var warning = 'Non-translated string used ' + locationDisplay + ' `' + node.chars + '`';

    this.log(warning);
  };

  LogStaticStrings.prototype.detect = function(node) {
    return node.type === 'TextNode' && !node.raw && node.chars.trim() !== '';
  };

  return LogStaticStrings;
};
