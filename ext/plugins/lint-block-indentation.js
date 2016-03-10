'use strict';

// Forces block syntax to have appropriate indentation
//
// passes:
// {{#each foo as |bar|}}
// {{/each}}
//
// breaks:
// {{#each foo as |bar|}}
//  {{/each}}

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var BlockIndentation = buildPlugin(addonContext, 'block-indentation');

  BlockIndentation.prototype.detect = function(node) {
    return node.type === 'BlockStatement' || node.type === 'ElementNode';
  };

  BlockIndentation.prototype.process = function(node) {
    // HTML elements that start and end on the same line are fine
    if (node.loc.start.line === node.loc.end.line) {
      return;
    }

    var isElementNode = node.type === 'ElementNode';
    var openCloseCharOffset = isElementNode ? 3 : 5;
    var displayName = isElementNode ? node.tag : node.path.original;
    var display = isElementNode ? '</' + displayName + '>' : '{{/' + displayName + '}}';
    var startColumn = node.loc.start.column;
    var endColumn   = node.loc.end.column;

    if (this.detectNestedElseBlock(node)) {
      this.processNestedElseBlock(node);
    }

    var startOffset = node._startOffset || 0;
    var correctedEndColumn = endColumn - displayName.length - openCloseCharOffset + startOffset;
    if(correctedEndColumn !== startColumn) {
      var startLocation = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);
      var endLocation = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.end);

      var warning = 'Incorrect indentation for `' + displayName + '` beginning at ' + startLocation +
            '. Expected `' + display + '` ending at ' + endLocation + 'to be at an indentation of ' + startColumn + ' but ' +
            'was found at ' + correctedEndColumn + '.';
      this.log(warning);
    }
  };

  BlockIndentation.prototype.detectNestedElseBlock = function(node) {
    var inverse = node.inverse;
    var firstItem = inverse && inverse.body[0];

    // handle `{{else if foo}}`
    if (inverse && firstItem && firstItem.type === 'BlockStatement') {
      return inverse.loc.start.line === firstItem.loc.start.line &&
        inverse.loc.start.column === firstItem.loc.start.column;
    }

    return false;
  };

  BlockIndentation.prototype.processNestedElseBlock = function(node) {
    var elseBlockStatement = node.inverse.body[0];

    elseBlockStatement._startOffset = 5 + elseBlockStatement.path.original.length;
  };

  return BlockIndentation;
};
