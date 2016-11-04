'use strict';

var buildPlugin = require('../base');

var DEPRECATION_URL = 'http://emberjs.com/deprecations/v1.x/#toc_ember-view';

var message = 'The inline form of `view` is deprecated. Please use the `Ember.Component` instead. ' +
 'See the deprecation guide at ' + DEPRECATION_URL;

function asElementAsAttributeString(tag, attributeName, value) {
  return '<' + tag + ' ' + attributeName + '={{' + value + '}}>' + '</' + tag + '>';
}

function asPassedPropertyString(componentName, keyName, value) {
  return '{{' + componentName + ' ' + keyName + '=' + value + '}}';
}

function logMessage(context, loc, actual, expected) {
  return context.log({
    message: message,
    line: loc && loc.start.line,
    column: loc && loc.start.column,
    source: actual,
    fix: {
      text: expected
    }
  });
}

module.exports = function(addonContext) {
  var DeprecatedInlineViewHelper = buildPlugin(addonContext, 'deprecated-inline-view-helper');

  DeprecatedInlineViewHelper.prototype.visitors = function() {
    return {
      ElementNode: function(node) {
        var attributes = node.attributes;

        for (var i = 0; i < attributes.length; i++) {
          var currentAttribute = attributes[i];
          var value = currentAttribute.value;

          if (value.type === 'MustacheStatement') {
            var originalValue = value.path.original;

            if (originalValue.split('.')[0] == 'view') {
              this.processAsElementAttribute(node, currentAttribute);
            }
          }
        }
      },

      MustacheStatement: function(node) {
        if (node.path.parts[0] === 'view') {
          if (node.params.length === 1) {
            this.processWithArgument(node);
          } else if (node.loc.start.line !== null) {
            this.processWithProperty(node);
          }
        } else {
          var pairs = node.hash.pairs;

          if (pairs.length > 0) {
            for (var i = 0; i < pairs.length; i++) {
              var currentPair = pairs[i];
              var originalValue = currentPair.value.original;

              if (originalValue.split('.')[0] == 'view') {
                this.processAsPassedProperty(node, currentPair);
              }
            }
          }
        }
      }
    };
  };

  DeprecatedInlineViewHelper.prototype.processAsElementAttribute = function(node, attribute) {
    var loc = node.loc;
    var tag = node.tag;
    var originalValue = attribute.value.path.original;
    var strippedValue = originalValue.replace('view.', '');
    var actual = asElementAsAttributeString(tag, attribute.name, originalValue);
    var expected = asElementAsAttributeString(tag, attribute.name, strippedValue);

    logMessage(this, loc, actual, expected);
  };

  DeprecatedInlineViewHelper.prototype.processWithProperty = function(node) {
    var loc = node.loc;
    var originalValue = node.path.original;
    var strippedValue = originalValue.replace('view.', '');
    var expected = '{{' + strippedValue + '}}';
    var actual = '{{' + originalValue + '}}';

    logMessage(this, loc, actual, expected);
  };

  DeprecatedInlineViewHelper.prototype.processWithArgument = function(node) {
    var loc = node.loc;
    var originalValue = node.params[0].original;
    var expected = '{{' + originalValue + '}}';
    var actual = '{{view \'' + originalValue + '\'}}';

    logMessage(this, loc, actual, expected);
  };

  DeprecatedInlineViewHelper.prototype.processAsPassedProperty = function(node, pair) {
    var loc = pair.loc;
    var componentName = node.path.original;
    var keyName = pair.key;
    var originalValue = pair.value.original;
    var strippedValue = originalValue.replace('view.', '');
    var actual = asPassedPropertyString(componentName, keyName, originalValue);
    var expected = asPassedPropertyString(componentName, keyName, strippedValue);

    logMessage(this, loc, actual, expected);
  };

  return DeprecatedInlineViewHelper;
};

module.exports.DEPRECATION_URL = DEPRECATION_URL;
