'use strict';

var buildPlugin = require('../base');

var DEPRECATION_URL = 'http://emberjs.com/deprecations/v1.x/#toc_ember-view';

var message = 'The inline form of `view` is deprecated. Please use the `Ember.Component` instead. ' +
 'See the deprecation guide at ' + DEPRECATION_URL;

module.exports = function(addonContext) {
  var DeprecatedInlineViewHelper = buildPlugin(addonContext, 'deprecated-inline-view-helper');

  DeprecatedInlineViewHelper.prototype.visitors = function() {
    return {
      MustacheStatement: function(node) {
        if (node.path.parts[0] === 'view') {
          if (node.params.length === 1) {
            this.processWithArgument(node);
          } else {
            this.processWithProperty(node);
          }
        }
      }
    };
  };

  DeprecatedInlineViewHelper.prototype.processWithProperty = function(node) {
    var loc = node.loc;
    var originalValue = node.path.original;
    var strippedValue = originalValue.replace('view.', '');
    var expected = '{{' + strippedValue + '}}';
    var actual = '{{' + originalValue + '}}';

    this.log({
      message: message,
      line: loc && loc.start.line,
      column: loc && loc.start.column,
      source: actual,
      fix: {
        text: expected
      }
    });
  };

  DeprecatedInlineViewHelper.prototype.processWithArgument = function(node) {
    var loc = node.loc;
    var originalValue = node.params[0].original;
    var expected = '{{' + originalValue + '}}';
    var actual = '{{view \'' + originalValue + '\'}}';

    this.log({
      message: message,
      line: loc && loc.start.line,
      column: loc && loc.start.column,
      source: actual,
      fix: {
        text: expected
      }
    });
  };

  return DeprecatedInlineViewHelper;
};

module.exports.DEPRECATION_URL = DEPRECATION_URL;
