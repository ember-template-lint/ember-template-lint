'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const buildPlugin = require('./base');

module.exports = function(addonContext) {
  let LogHtmlComments = buildPlugin(addonContext, 'html-comments');

  LogHtmlComments.prototype.parseConfig = function(config) {
    let configType = typeof config;

    let errorMessage = 'The html-comments rule accepts one of the following values.\n ' +
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

  LogHtmlComments.prototype.visitors = function() {
    return {
      CommentStatement: function(node) {
        if (AstNodeInfo.isNonConfigurationHtmlComment(node)) {
          this.log({
            message: 'HTML comment detected',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: '<!--' + node.value + '-->',
            fix: {
              text: '{{!' + node.value + '}}'
            }
          });
        }
      }
    };
  };

  return LogHtmlComments;
};
