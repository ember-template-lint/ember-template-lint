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
    return (node.type === 'BlockStatement');
  };

  BlockIndentation.prototype.process = function(node) {
    var startColumn = node.loc.start.column;
    var endColumn   = node.loc.end.column;

    var correctedEndColumn = endColumn - node.path.original.length - 5;
    if(correctedEndColumn !== startColumn) {
      var location = calculateLocationDisplay(this.options.moduleName, node.loc);
      var warning  = 'Incorrect `' + node.path.original + '` block indention at beginning at ' + location;
      this.log(warning);
    }
  };

  return BlockIndentation;
};
