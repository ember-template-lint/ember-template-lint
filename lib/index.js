var compile = require('htmlbars').compile;
var plugins = require('./rules');
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
    if (this.options.config) {
      this.config = this.options.config;
    } else {
      this.config = getConfig(this.options);
    }
  },

  buildASTPlugins: function(results) {
    function addToResults(result) {
      results.push(result);
    }

    var astPlugins = [];
    for (var pluginName in plugins) {
      var plugin = plugins[pluginName]({
        name: pluginName,
        config: this.config.rules[pluginName],
        log: addToResults
      });

      astPlugins.push(plugin);
    }

    return astPlugins;
  },

  verify: function(options) {
    var messages = [];

    try {
      compile(options.source, {
        moduleName: options.moduleId,
        rawSource: options.source,
        plugins: {
          ast: this.buildASTPlugins(messages)
        }
      });
    } catch (error) {
      messages.push({
        fatal: true,
        message: error.message,
        source: error.stack
      });
    }

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
