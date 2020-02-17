'use strict';

const { preprocess, traverse } = require('@glimmer/syntax');
const Minimatch = require('minimatch').Minimatch;
const getConfig = require('./get-config');
const expandFileGlobs = require('../lib/helpers/expand-file-globs');
const stripBom = require('strip-bom');
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

  findRulesForPath(overrides, filePath) {
    return overrides.find(item => item.files.includes(filePath));
  }

  buildRules(config) {
    let rules = [];

    let loadedRules = this.config.loadedRules;
    let configuredRules = this.config.rules;

    // Overrides related.
    const overridesObj = this.findRulesForPath(config.overrides, config.filePath) || {};
    const { rules: overrideRuleset, severity: overrideSeverity } = overridesObj;

    // If there is an override present, then the overridden ruleset takes precedence.
    if (overrideRuleset) {
      configuredRules = Object.assign({}, configuredRules, overrideRuleset);
    }

    function addToResults(result) {
      config.results.push(result);
    }

    for (let ruleName in configuredRules) {
      if (configuredRules[ruleName] === false) {
        continue;
      }

      let Rule = loadedRules[ruleName];
      if (!Rule) {
        addToResults({
          severity: 2,
          moduleId: config.moduleId,
          message: `Definition for rule '${ruleName}' was not found`,
        });

        continue;
      }

      try {
        let rule = new Rule({
          name: ruleName,
          config: configuredRules[ruleName],
          console: this.console,
          log: addToResults,
          defaultSeverity:
            overrideSeverity || this._defaultSeverityForRule(ruleName, config.pending),
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

  getRulesForOverrides(overrides) {
    if (overrides.length) {
      return overrides.map(item => {
        const fileArr = Array.from(expandFileGlobs(item.files, true));
        item.files = fileArr.length ? fileArr : item.files;
        return item;
      });
    }
    return [];
  }

  verify(options) {
    let messages = [];
    let pendingStatus = this.statusForModule('pending', options.moduleId);
    let shouldIgnore = this.statusForModule('ignore', options.moduleId);

    let overrides = JSON.parse(JSON.stringify(this.config.overrides));
    let overrideRules = this.getRulesForOverrides(overrides);

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
      overrides: overrideRules,
      results: messages,
      filePath: options.filePath,
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

    if (pendingStatus) {
      if (messages.length === 0) {
        messages.push({
          rule: 'invalid-pending-module',
          message: `Pending module (\`${options.moduleId}\`) passes all rules. Please remove \`${options.moduleId}\` from pending list.`,
          moduleId: options.moduleId,
          severity: 2,
        });
      } else {
        if (pendingStatus.only) {
          let failedRules = messages.reduce((rules, message) => rules.add(message.rule), new Set());

          pendingStatus.only.forEach(pendingRule => {
            if (!failedRules.has(pendingRule)) {
              messages.push({
                rule: 'invalid-pending-module-rule',
                message: `Pending module (\`${options.moduleId}\`) passes \`${pendingRule}\` rule. Please remove \`${pendingRule}\` from pending rules list.`,
                moduleId: options.moduleId,
                severity: 2,
              });
            }
          });
        }
      }
    }

    return messages;
  }

  // this should eventually be removed but is currently still used by ember-cli-template-lint
  static errorsToMessages(filePath, errors, options) {
    errors = errors || [];
    options = options || {
      verbose: false,
    };

    let PrettyPrinter = require('./printers/pretty');
    return PrettyPrinter.errorsToMessages(filePath, errors, options);
  }
}

module.exports = Linter;
module.exports.Rule = require('./rules/base');
module.exports.ASTHelpers = require('./helpers/ast-node-info');

module.exports.WARNING_SEVERITY = WARNING_SEVERITY;
module.exports.ERROR_SEVERITY = ERROR_SEVERITY;
