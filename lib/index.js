var precompile = require('glimmer-engine').precompile;
var getConfig = require('./get-config');

var WARNING_SEVERITY = 1;
var ERROR_SEVERITY = 2;

function Linter(_options) {
  var options = _options || {};

  this.options = options;
  this.console = options.console || console;

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

    var rules = this.config.loadedRules;

    var astPlugins = [];
    for (var pluginName in rules) {

      var plugin = rules[pluginName]({
        name: pluginName,
        config: this.config.rules[pluginName],
        console: this.console,
        log: addToResults,
        defaultSeverity: this._defaultSeverityForRule(pluginName, config.pending)
      });

      astPlugins.push(plugin);
    }

    return astPlugins;
  },

  statusForModule: function(type, moduleId) {
    var list = this.config[type];
    if (!list) { return false; }

    for (var i = 0; i < list.length; i++) {
      var item = list[i];

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
    var pendingStatus = this.statusForModule('pending', options.moduleId);
    var shouldIgnore = this.statusForModule('ignore', options.moduleId);

    if (shouldIgnore) {
      return messages;
    }

    var pluginConfig = {
      results: messages,
      pending: pendingStatus
    };

    try {
      precompile(options.source, {
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

Linter.errorsToMessages = function(errors) {
  return errors.map(function(error) {
    var message = error.rule + ': ' + error.message + ' (' + error.moduleId;

    if (error.line && error.column) {
      message += ' @ L' + error.line + ':C' + error.column;
    }

    message += ')';

    if (error.source) message += ':\n`' + error.source + '`';

    return message;
  }).join('\n');
};

module.exports = Linter;
