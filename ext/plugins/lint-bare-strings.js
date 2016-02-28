// Disallows the use of bare strings in a template
//
// passes:
// <div>{{evaluatesToAString}}</div>
//
// breaks:
// <div>A bare string</div>

var calculateLocationDisplay = require('../helpers/calculate-location-display');

module.exports = function(addonContext) {
  var config = addonContext.loadConfig()['bare-strings'];

  function LogStaticStrings(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars
  }

  LogStaticStrings.prototype.transform = function(ast) {
    if (config === false) {
      return ast;
    }

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
    var warning = 'Non-translated string used ' + locationDisplay + ' `' + node.chars + '`';
    addonContext.logLintingError("bare-strings", this.options.moduleName, warning);
  }

  LogStaticStrings.prototype.detectStaticString = function(node) {
    return node.type === 'TextNode' && !node.raw && node.chars.trim() !== '';
  };

  return LogStaticStrings
};
