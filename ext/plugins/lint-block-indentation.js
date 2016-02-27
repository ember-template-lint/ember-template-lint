var calculateLocationDisplay = require('../helpers/calculate-location-display');

function BlockIndentation(options) {
  this.options = options;
  this.syntax = null; // set by HTMLBars
}

BlockIndentation.prototype.transform = function(ast) {
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
    throw new Error(`Incorrect '${node.path.original}' block indention at beginning at ${location}`);
  }
}

module.exports = BlockIndentation;
