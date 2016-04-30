'use strict';

var buildPlugin = require('../base');
var astInfo = require('../../helpers/ast-node-info');

var DEPRECATION_URL = 'http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code';

module.exports = function(addonContext) {

  var DeprecatedEachSyntax = buildPlugin(addonContext, 'deprecated-each-syntax');

  DeprecatedEachSyntax.prototype.detect = function(node) {
    return astInfo.isBlockStatement(node) &&
      node.path.original === 'each' &&
      node.params.length > 1 &&
      node.params[1].original === 'in';
  };

  DeprecatedEachSyntax.prototype.process = function(node) {
    var params = node.params;
    var singular = params[0].original;
    var collection = params[2].original;

    var actual = '{{#each ' + singular + ' in ' + collection + '}}';
    var expected = '{{#each ' + collection + ' as |' + singular + '|}}';

    var message = [
      'Deprecated {{#each}} usage ',
      'Actual: ' + actual,
      'Expected (rewrite the template to this): ' + expected,
      'The `#each in` syntax was deprecated in 1.11 and removed in Ember 2.0.',
      'See the deprecation guide at ' + DEPRECATION_URL
    ].join('\n');

    this.log({
      message: message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node)
    });
  };

  return DeprecatedEachSyntax;
};
