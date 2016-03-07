'use strict';

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var LogTripleCurlies = buildPlugin(addonContext, 'triple-curlies');

  LogTripleCurlies.prototype.detect = function(node) {
    return node.type === 'MustacheStatement' && !node.escaped;
  };

  LogTripleCurlies.prototype.process = function(node) {
    var location = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);

    this.log('Usage of triple curly brackets is unsafe `{{{' + node.path.original + '}}}` at ' + location);
  };

  return LogTripleCurlies;
};
