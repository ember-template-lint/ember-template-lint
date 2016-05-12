'use strict';

var buildPlugin = require('../base');

var DEPRECATION_URL = 'http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code';

module.exports = function(addonContext) {

  var DeprecatedEachSyntax = buildPlugin(addonContext, 'deprecated-each-syntax');

  DeprecatedEachSyntax.prototype.visitors = function() {
    return {
      BlockStatement: function(node) {
        if (node.path.original === 'each') {
          this.process(node);
        }
      }
    };
  };

  DeprecatedEachSyntax.prototype.process = function(node) {
    var isEachIn = node.params.length > 1 && node.params[1].original === 'in';
    var isEachContextShifting = node.params.length === 1 && node.program.blockParams.length === 0;

    if (isEachIn) {
      this.processEachIn(node);
    } else if (isEachContextShifting) {
      this.processEachContextShifting(node);
    }
  };

  DeprecatedEachSyntax.prototype.processEachIn = function(node) {
    var params = node.params;
    var singular = params[0].original;
    var collection = params[2].original;

    var actual = '{{#each ' + singular + ' in ' + collection + '}}';
    var expected = '{{#each ' + collection + ' as |' + singular + '|}}';

    var message = 'Deprecated {{#each}} usage. See the deprecation guide at ' + DEPRECATION_URL;

    this.log({
      message: message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: actual,
      fix: {
        text: expected
      }
    });
  };

  DeprecatedEachSyntax.prototype.processEachContextShifting = function(node) {
    var params = node.params;
    var collection = params[0].original;

    var actual = '{{#each ' + collection + '}}';
    var expected = '{{#each ' + collection + ' as |item|}}';

    var message = 'Deprecated {{#each}} usage. See the deprecation guide at ' + DEPRECATION_URL;

    this.log({
      message: message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: actual,
      fix: {
        text: expected
      }
    });
  };

  return DeprecatedEachSyntax;
};


module.exports.DEPRECATION_URL = DEPRECATION_URL;
