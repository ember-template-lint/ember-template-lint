'use strict';

const precompile = require('@glimmer/compiler').precompile;
const Minimatch = require('minimatch').Minimatch;
const getConfig = require('./get-config');
const stripBom = require('strip-bom');
const chalk = require('chalk');

const TransformDotComponentInvocation = require('./plugins/transform-dot-component-invocation');

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
    let astPlugins = [TransformDotComponentInvocation];

    for (let pluginName in rules) {

      let Plugin = rules[pluginName];
      let plugin = new Plugin({
        name: pluginName,
        config: this.config.rules[pluginName],
        console: this.console,
        log: addToResults,
        defaultSeverity: this._defaultSeverityForRule(pluginName, config.pending)
      });

      astPlugins.push(env => {
        plugin.templateEnvironmentData = env;

        let visitor = plugin.getVisitor();

        return {
          name: pluginName,
          visitor
        };
      });
    }

    return astPlugins;
  }

  statusForModule(type, moduleId) {
    let list = this.config[type];
    if (!list) { return false; }

    for (let i = 0; i < list.length; i++) {
      let item = list[i];

      if (item instanceof Minimatch && item.match(moduleId)) {
        return true;
      } else if (typeof item === 'string' && moduleId === item) {
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

  static errorsToMessages(filePath, errors, options) {
    errors = errors || [];
    options = options || {
      verbose: false
    };

    if (errors.length === 0) {
      return '';
    }

    let errorsMessages = errors.map((error) => this._formatError(error, options)).join('\n');

    return `${chalk.underline(filePath)}\n${errorsMessages}\n`;
  }

  static _formatError(error, options) {
    let message = '';
    let severities = {
      1: 'warrning',
      2: 'error'
    };

    if (error.line && error.column) {
      message += chalk.dim(`  ${error.line}:${error.column}`);
    } else {
      message += chalk.dim('  -:-');
    }

    message += `  ${chalk.red(severities[error.severity] || 'error')}`;
    message += `  ${error.message}  ${chalk.dim(error.rule)}`;

    if (options.verbose) {
      message += `\n${error.source}`;
    }

    return message;
  }
}

module.exports = Linter;
module.exports.Rule = require('./rules/base');
module.exports.ASTHelpers = require('./helpers/ast-node-info');
