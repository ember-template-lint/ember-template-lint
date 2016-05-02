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
    this.config = getConfig(this.options);
  },

  buildASTPlugins: function(config) {
    var results = config.results;
    var defaultSeverity = config.pending ? 1 : 2;

    function addToResults(result) {
      results.push(result);
    }

    var astPlugins = [];
    for (var pluginName in plugins) {
      var plugin = plugins[pluginName]({
        name: pluginName,
        config: this.config.rules[pluginName],
        log: addToResults,
        defaultSeverity: defaultSeverity
      });

      astPlugins.push(plugin);
    }

    return astPlugins;
  },

  isPending: function(moduleId) {
    return this.config.pending.indexOf(moduleId) > -1;
  },

  verify: function(options) {
    var messages = [];
    var moduleIsPending = this.isPending(options.moduleId);

    var pluginConfig = {
      results: messages,
      pending: moduleIsPending
    };

    try {
      compile(options.source, {
        moduleName: options.moduleId,
        rawSource: options.source,
        plugins: {
          ast: this.buildASTPlugins(pluginConfig)
        }
      });
    } catch (error) {
      messages.push({
        fatal: true,
        moduleId: options.moduleId,
        message: error.message,
        source: error.stack,
        severity: 2
      });
    }

    if (moduleIsPending && messages.length === 0) {
      messages.push({
        message: 'Pending module (`' + options.moduleId + '`) passes all rules. Please remove `' + options.moduleId + '` from pending list.',
        moduleId: options.moduleId,
        severity: 2
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
