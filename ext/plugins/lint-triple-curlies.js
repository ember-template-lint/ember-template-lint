var calculateLocationDisplay = require('../helpers/calculate-location-display');

module.exports = function(addonContext) {
  var config = addonContext.loadConfig()['triple-curlies'];

  function LogTripleCurlies(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars
  }

  LogTripleCurlies.prototype.transform = function(ast) {
    if (config === false) {
      return ast;
    }

    var pluginContext = this;
    var b = this.syntax.builders;
    var walker = new this.syntax.Walker();

    walker.visit(ast, function(node) {
      if (pluginContext.detectTriple(node)) {
        return pluginContext.processTriple(node);
      }
    });

    return ast;
  };

  LogTripleCurlies.prototype.detectTriple = function(node) {
    return node.type === 'MustacheStatement' && !node.escaped;
  };

  LogTripleCurlies.prototype.processTriple = function(node) {
    var location = calculateLocationDisplay(this.options.moduleName, node.loc);

    addonContext.logLintingError('triple-curlies', this.options.moduleName, 'Usage of triple curly brackets is unsafe `{{{' + node.path.original + '}}}` at ' + location);
  };

  return LogTripleCurlies;
};
