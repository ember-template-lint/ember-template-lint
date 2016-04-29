var compile = require('htmlbars').compile;
var plugins = require('../ext/plugins');
var getConfig = require('./get-config');

function Linter(_options) {
  var options = _options || {};

  this.options = options;
  this.console = options.console || {};

  this.loadConfig();
}

Linter.prototype = {
  constructor: Linter,

  loadConfig: function() {
    this.config = getConfig(this.console, this.options.configPath);
  },

  buildASTPlugins: function() {
    if (this._astPlugins) {
      return this._astPlugins;
    }

    var astPlugins = [];
    for (var pluginName in plugins) {
      astPlugins.push(plugins[pluginName](this));
    }

    return this._astPlugins = astPlugins;
  },

  verify: function(options) {
    this._messages = [];

    compile(options.source, {
      moduleName: options.moduleId,
      rawSource: options.source,
      plugins: {
        ast: this.buildASTPlugins()
      }
    });

    return this._messages;
  },

  logLintingError: function(name, moduleName, message) {
    this._messages.push({
      rule: name,
      moduleId: moduleName,
      message: message
    });

    this.console.log(message);
  }
};

module.exports = Linter;
