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

  buildASTPlugins: function(results) {
    function addToResults(result) {
      results.push(result);
    }

    var astPlugins = [];
    for (var pluginName in plugins) {
      var plugin = plugins[pluginName]({
        name: pluginName,
        config: this.config[pluginName],
        log: addToResults
      });

      astPlugins.push(plugin);
    }

    return astPlugins;
  },

  verify: function(options) {
    var messages = [];

    compile(options.source, {
      moduleName: options.moduleId,
      rawSource: options.source,
      plugins: {
        ast: this.buildASTPlugins(messages)
      }
    });

    return messages;
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
