module.exports = function(addonContext, name) {
  function BasePlugin(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars
    this.config = addonContext.loadConfig()[name];
  }

  BasePlugin.prototype.transform = function(ast) {
    if (this.config === false) {
      return ast;
    }

    var pluginContext = this;
    var walker = new this.syntax.Walker();

    walker.visit(ast, function(node) {
      if (pluginContext.detect(node)) {
        return pluginContext.process(node);
      }
    });

    return ast;
  };

  BasePlugin.prototype.log = function(message) {
    addonContext.logLintingError(name, this.options.moduleName, message);
  };

  BasePlugin.prototype.detect = function() {
    throw new Error('Must implemented #detect');
  };

  BasePlugin.prototype.process = function() {
    throw new Error('Must implemented #process');
  };

  return BasePlugin;
};
