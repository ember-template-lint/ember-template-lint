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

module.exports = function(addonContext) {
  var config = addonContext.loadConfig()['block-indentation'];

  function BlockIndentation(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars
  }

  BlockIndentation.prototype.transform = function(ast) {
    if (config === false) {
      return ast;
    }
    var pluginContext = this;
    var b = this.syntax.builders;
    var walker = new this.syntax.Walker();

    walker.visit(ast, function(node) {
      if (pluginContext.detectBlock(node)) {
        return pluginContext.processBlock(node);
      }
    });

    return ast;
  };

  BlockIndentation.prototype.detectBlock = function(node) {
    return (node.type === 'BlockStatement')
  }

  BlockIndentation.prototype.processBlock = function(node) {
    var startColumn = node.loc.start.column
    var endColumn   = node.loc.end.column

    var correctedEndColumn = endColumn - node.path.original.length - 5;
    if(correctedEndColumn !== startColumn) {
      var location = calculateLocationDisplay(this.options.moduleName, node.loc);
      var warning  = 'Incorrect `' + node.path.original + '` block indention at beginning at ' + location;
      addonContext.logLintingError('block-indentation', this.options.moduleName, warning);
    }
  }

  return BlockIndentation
};
