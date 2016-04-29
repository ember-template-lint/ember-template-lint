'use strict';

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
    this.log({
      message: 'HTML comment detected',
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: '<!-- ' + node.value + '-->'
    });
  };

  return LogHtmlComments;
};
