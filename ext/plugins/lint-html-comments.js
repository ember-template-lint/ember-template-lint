'use strict';

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var AstNodeInfo = require('../helpers/ast-node-info');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var LogHtmlComments = buildPlugin(addonContext, 'html-comments');

  LogHtmlComments.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The html-comments rule accepts one of the following values.\n ' +
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

  LogHtmlComments.prototype.detect = function(node) {
    return AstNodeInfo.isNonConfigurationHtmlComment(node);
  };

  LogHtmlComments.prototype.process = function(node) {
    var location = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);
    this.log('Html comment detected `<!--' + node.value + '-->` at ' + location +
      '. Use Handlebars comment instead `{{!--' + node.value +'--}}`');
  };

  return LogHtmlComments;
};
