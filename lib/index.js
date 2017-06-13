'use strict';

const precompile = require('glimmer-engine').precompile;
const getConfig = require('./get-config');
const stripBom = require('strip-bom');

const WARNING_SEVERITY = 1;
const ERROR_SEVERITY = 2;

class Linter {
  constructor(_options) {
    let options = _options || {};

    this.options = options;
    this.console = options.console || console;

    this.loadConfig();
    this.constructor = Linter;
  }

  loadConfig() {
    this.config = getConfig(this.options);
  }

  _defaultSeverityForRule(ruleName, pendingStatus) {
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
  }

  buildASTPlugins(config) {
    let results = config.results;

    function addToResults(result) {
      results.push(result);
    }

    let rules = this.config.loadedRules;

    let astPlugins = [];
    for (let pluginName in rules) {

      let plugin = rules[pluginName]({
        name: pluginName,
        config: this.config.rules[pluginName],
        console: this.console,
        log: addToResults,
        defaultSeverity: this._defaultSeverityForRule(pluginName, config.pending)
      });

      astPlugins.push(plugin);
    }

    return astPlugins;
  }

  statusForModule(type, moduleId) {
    let list = this.config[type];
    if (!list) { return false; }

    for (let i = 0; i < list.length; i++) {
      let item = list[i];

      if (typeof item === 'string' && moduleId === item) {
        return true;
      } else if (item.moduleId === moduleId){
        return item;
      }
    }

    return false;
  }

  verify(options) {
    let messages = [];
    let pendingStatus = this.statusForModule('pending', options.moduleId);
    let shouldIgnore = this.statusForModule('ignore', options.moduleId);

    if (shouldIgnore) {
      return messages;
    }

    let pluginConfig = {
      results: messages,
      pending: pendingStatus
    };

    try {
      precompile(stripBom(options.source), {
        moduleName: options.moduleId,
        rawSource: stripBom(options.source),
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
        message: `Pending module (\`${options.moduleId}\`) passes all rules. Please remove \`${options.moduleId}\` from pending list.`,
        moduleId: options.moduleId,
        severity: 2
      });
    }

    return messages;
  }

  logLintingError(name, moduleName, message) {
    this._messages.push({
      rule: name,
      moduleId: moduleName,
      message: message
    });

    this.console.log(message);
  }

  static errorsToMessages(errors) {
    return errors.map(error => {
      let message = `${error.rule}: ${error.message} (${error.moduleId}`;

      if (error.line && error.column) {
        message += ` @ L${error.line}:C${error.column}`;
      }

      message += ')';

      if (error.source) message += ':\n`' + error.source + '`';

      return message;
    }).join('\n');
  }
}

module.exports = Linter;
