var calculateLocationDisplay = require('../helpers/calculate-location-display');

function LogStaticStrings(options) {
  this.options = options;
  this.syntax = null; // set by HTMLBars
}

LogStaticStrings.prototype.transform = function(ast) {
  var pluginContext = this;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function(node) {
    if (pluginContext.detectStaticString(node)) {
      return pluginContext.processStaticString(node);
    }
  });

  return ast;
};

LogStaticStrings.prototype.processStaticString = function(node) {
  var locationDisplay = calculateLocationDisplay(this.options.moduleName, node.loc);

  throw new Error(`Non-translated string used ${locationDisplay} \`${node.chars}\``);
}

LogStaticStrings.prototype.detectStaticString = function(node) {
  return node.type === 'TextNode' && !node.raw && node.chars.trim() !== '';
};

module.exports = LogStaticStrings;
