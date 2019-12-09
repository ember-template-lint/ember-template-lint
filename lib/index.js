'use strict';

const { preprocess, traverse } = require('@glimmer/syntax');
const Minimatch = require('minimatch').Minimatch;
const getConfig = require('./get-config');
const stripBom = require('strip-bom');
const chalk = require('chalk');
let path = require('path');

function buildErrorMessage(moduleId, error) {
  let message = {
    fatal: true,
    severity: 2,
    moduleId,
    message: error.message,
    source: error.stack,
  };

  if (error.location) {
    message.column = error.location.start.column;
    message.line = error.location.start.line;
  }

  return message;
}

function buildPlugin(rule) {
  let visitor = rule.getVisitor();

  return visitor;
}

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
    } else if (pendingStatus.only) {
      if (pendingStatus.only.indexOf(ruleName) > -1) {
        return WARNING_SEVERITY;
      } else {
        return ERROR_SEVERITY;
      }
    }

    return 2;
  }

  buildRules(config) {
    let rules = [];

    let loadedRules = this.config.loadedRules;
    let configuredRules = this.config.rules;

    function addToResults(result) {
      config.results.push(result);
    }

    for (let ruleName in configuredRules) {
      if (configuredRules[ruleName] === false) {
        continue;
      }

      let Rule = loadedRules[ruleName];

      try {
        let rule = new Rule({
          name: ruleName,
          config: this.config.rules[ruleName],
          console: this.console,
          log: addToResults,
          defaultSeverity: this._defaultSeverityForRule(ruleName, config.pending),
          ruleNames: Object.keys(loadedRules),
          moduleName: config.moduleName,
          rawSource: config.rawSource,
        });

        rules.push(rule);
      } catch (error) {
        let message = buildErrorMessage(config.moduleId, error);
        addToResults(message);
      }
    }

    return rules;
  }

  statusForModule(type, moduleId) {
    let list = this.config[type];
    let configPath = this.options.configPath || '';
    if (!list) {
      return false;
    }

    for (let i = 0; i < list.length; i++) {
      let item = list[i];

      let fullPathModuleId = path.resolve(process.cwd(), moduleId);

      if (item instanceof Minimatch && item.match(moduleId)) {
        return true;
      } else if (typeof item === 'string') {
        let fullPathItem = path.resolve(process.cwd(), path.dirname(configPath), item);
        if (fullPathModuleId === fullPathItem) {
          return true;
        }
      } else if (item.moduleId) {
        let fullPathItem = path.resolve(process.cwd(), path.dirname(configPath), item.moduleId);
        if (fullPathModuleId === fullPathItem) {
          return item;
        }
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

    let source = stripBom(options.source);

    let templateAST;

    try {
      templateAST = preprocess(source, {
        mode: 'codemod',
      });
    } catch (error) {
      let message = buildErrorMessage(options.moduleId, error);
      messages.push(message);
    }

    let rules = this.buildRules({
      results: messages,
      pending: pendingStatus,
      moduleId: options.moduleId,
      moduleName: options.moduleId,
      rawSource: source,
    });

    for (let rule of rules) {
      try {
        traverse(templateAST, buildPlugin(rule));
      } catch (error) {
        let message = buildErrorMessage(options.moduleId, error);
        messages.push(message);
      }
    }

    if (pendingStatus && messages.length === 0) {
      messages.push({
        message: `Pending module (\`${options.moduleId}\`) passes all rules. Please remove \`${options.moduleId}\` from pending list.`,
        moduleId: options.moduleId,
        severity: 2,
      });
    }

    return messages;
  }

  logLintingError(name, moduleName, message) {
    this._messages.push({
      rule: name,
      moduleId: moduleName,
      message,
    });

    this.console.log(message);
  }

  static errorsToMessages(filePath, errors, options) {
    errors = errors || [];
    options = options || {
      verbose: false,
    };

    if (errors.length === 0) {
      return '';
    }

    let errorsMessages = errors.map(error => this._formatError(error, options)).join('\n');

    return `${chalk.underline(filePath)}\n${errorsMessages}\n`;
  }

  static _formatError(error, options) {
    let message = '';

    let line = error.line === undefined ? '-' : error.line;
    let column = error.column === undefined ? '-' : error.column;

    message += chalk.dim(`  ${line}:${column}`);

    if (error.severity === WARNING_SEVERITY) {
      message += `  ${chalk.yellow('warning')}`;
    } else {
      message += `  ${chalk.red('error')}`;
    }

    message += `  ${error.message}  ${chalk.dim(error.rule)}`;

    if (options.verbose) {
      message += `\n${error.source}`;
    }

    return message;
  }

  reportGitHubActionAnnotations(errors) {
    if (!process.env.GITHUB_ACTIONS || process.env.DISABLE_GITHUB_ACTIONS_ANNOTATIONS) {
      return;
    }

    let files = Object.keys(errors);
    for (let file of files) {
      let fileErrors = errors[file];
      for (let error of fileErrors) {
        let line = error.line;
        let col = error.column;

        let annotation = Linter._formatGitHubActionAnnotation(error.message, { file, line, col });
        this.console.log(annotation);
      }
    }
  }

  static _formatGitHubActionAnnotation(message, options = {}) {
    message = message || '';

    let output = '::error';

    let outputOptions = Object.keys(options)
      .map(key => `${key}=${escape(String(options[key]))}`)
      .join(',');

    if (outputOptions) {
      output += ` ${outputOptions}`;
    }

    return `${output}::${escapeData(message)}`;
  }
}

function escapeData(s) {
  return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escape(s) {
  return s
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
    .replace(/]/g, '%5D')
    .replace(/;/g, '%3B');
}

module.exports = Linter;
module.exports.Rule = require('./rules/base');
module.exports.ASTHelpers = require('./helpers/ast-node-info');

module.exports.WARNING_SEVERITY = WARNING_SEVERITY;
module.exports.ERROR_SEVERITY = ERROR_SEVERITY;
