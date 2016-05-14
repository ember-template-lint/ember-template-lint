var compile = require('htmlbars').compile;
var plugins = require('./rules');
var getConfig = require('./get-config');

var WARNING_SEVERITY = 1;
var ERROR_SEVERITY = 2;

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

  _defaultSeverityForRule: function(ruleName, pendingStatus) {
    if (typeof pendingStatus === 'boolean') {
      return pendingStatus ? WARNING_SEVERITY : ERROR_SEVERITY;
    } else if (pendingStatus.only){
      if (pendingStatus.only.indexOf(ruleName) > -1) {
        return WARNING_SEVERITY;
      } else {
        return ERROR_SEVERITY;
      }
    }

    return 2;
  },

  buildASTPlugins: function(config) {
    var results = config.results;

    function addToResults(result) {
      results.push(result);
    }

    var astPlugins = [];
    for (var pluginName in plugins) {

      var plugin = plugins[pluginName]({
        name: pluginName,
        config: this.config.rules[pluginName],
        log: addToResults,
        defaultSeverity: this._defaultSeverityForRule(pluginName, config.pending)
      });

      astPlugins.push(plugin);
    }

    return astPlugins;
  },

  pendingStatusForModule: function(moduleId) {
    var pendingList = this.config.pending;
    for (var i = 0; i < pendingList.length; i++) {
      var item = pendingList[i];

      if (typeof item === 'string' && moduleId === item) {
        return true;
      } else if (item.moduleId === moduleId){
        return item;
      }
    }

    return false;
  },

  verify: function(options) {
    var messages = [];
    var pendingStatus = this.pendingStatusForModule(options.moduleId);

    var pluginConfig = {
      results: messages,
      pending: pendingStatus
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

    if (pendingStatus && messages.length === 0) {
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
