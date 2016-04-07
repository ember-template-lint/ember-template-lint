'use strict';

// this Babel plugin is used in the acceptance tests to ensure that there are
// no configuration comments in the final output, such as:
//   <!-- template-lint triple-curlies=false -->
//   <!-- template-lint enabled=false -->

var buildPlugin = require('../base');
var AstNodeInfo = require('../../helpers/ast-node-info');

module.exports = function(addonContext) {
  var LintConfigurationHtmlComments = buildPlugin(addonContext, 'lint-configuration-html-comments');

  LintConfigurationHtmlComments.prototype.detect = function(node) {
    return AstNodeInfo.isConfigurationHtmlComment(node);
  };

  LintConfigurationHtmlComments.prototype.process = function(node) {
    this.log('Html comment detected `<!--' + node.value + '-->`');
  };

  return LintConfigurationHtmlComments;
};
