'use strict';

var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var LogTripleCurlies = buildPlugin(addonContext, 'triple-curlies');

  LogTripleCurlies.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The triple-curlies rule accepts one of the following values.\n ' +
          '  * boolean - `true` to enable / `false` to disable\n' +
          '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      return config;
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  };

  LogTripleCurlies.prototype.detect = function(node) {
    return node.type === 'MustacheStatement' && !node.escaped;
  };

  LogTripleCurlies.prototype.process = function(node) {
    this.log({
      message: 'Usage of triple curly brackets is unsafe',
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: '{{{' + node.path.original + '}}}'
    });
  };

  return LogTripleCurlies;
};
