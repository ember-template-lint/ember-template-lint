const { parse, transform } = require('ember-template-recast');
const micromatch = require('micromatch');
const getConfig = require('./get-config');
const stripBom = require('strip-bom');
const EditorConfigResolver = require('./get-editor-config');
let path = require('path');

const MAX_AUTOFIX_PASSES = 10;

const WARNING_SEVERITY = 1;
const ERROR_SEVERITY = 2;

/**
 * @param {Object} options
 * @param {string} options.source - The source code to fix.
 * @param {Object[]} messages - The lint messages.
 * @returns {string} output - The fixed source.
 */
function applyFixes(options /* messages */) {
  return options.source;
}

function buildErrorMessage(filePath, moduleId, error) {
  let message = {
    fatal: true,
    severity: ERROR_SEVERITY,
    filePath,
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

class Linter {
  constructor(_options) {
    let options = _options || {};

    this.options = options;
    this.console = options.console || console;

    this.loadConfig();
    this.constructor = Linter;
    this.editorConfigResolver = new EditorConfigResolver();
    this.editorConfigResolver.resolveEditorConfigFiles();
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

    return ERROR_SEVERITY;
  }

  /**
   * Builds the rule specified. The rule constructor is loaded from the list of
   * known rules (will include both the list of internal rules and any from
   * plugins).
   *
   * @private
   * @param {string} ruleName The name of the rule to build
   * @param {Object} options See buildRules for detailed properties
   * @returns {Rule} The rule that was built
   */
  _buildRule(ruleName, options, addToResults) {
    let loadedRules = this.config.loadedRules;
    let Rule = loadedRules[ruleName];

    let ruleOptions = Object.assign(
      {
        name: ruleName,
        config: this.config.rules[ruleName],
        console: this.console,
        log: addToResults,
        defaultSeverity: this._defaultSeverityForRule(ruleName, options.pending),
        ruleNames: Object.keys(loadedRules),
      },
      options
    );

    ruleOptions.configResolver = Object.assign(
      {
        editorConfig: () => {
          if (!options.filePath) {
            return {};
          }

          return this.editorConfigResolver.getEditorConfigData(options.filePath);
        },
      },
      options.configResolver
    );

    let rule = new Rule(ruleOptions);

    return rule;
  }

  /**
   * Builds an array of rules to be ran for the current configuration, on a specific file.
   *
   * @private
   *
   * @param {Object} options
   * @param {boolean} options.pending Indicates if this module + rule combination are configured as pending
   * @param {string} options.filePath The full on-disk path to the file being linted
   * @param {string} options.moduleId The pseudo path for the file being linted (when using ember-cli-template-lint, this is effectively the "runtime module" for the template). Usage of `moduleId` should be avoided (favoring `filePath` instead)
   * @param {string} options.moduleName Same as `moduleId`, see above
   * @param {string} options.rawSource - The source for the file to be linted
   * @param {Object} [options.configResolver] A simple way to provide additional configuration into a rule. Currently used by plugins desiring `editorconfig` support, but to be expanded in the future
   *
   * @returns {Object} An object with an array of rule load failures, and an array of rule instances
   */
  buildRules(options) {
    let failures = [];
    let rules = [];

    let configuredRules = this.config.rules;

    // Overrides related.
    const overridesObj = this.findRulesForPath(this.config.overrides, config.filePath) || {};
    const { rules: overrideRuleset, severity: overrideSeverity } = overridesObj;

    // If there is an override present, then the overridden ruleset takes precedence.
    if (overrideRuleset) {
      configuredRules = Object.assign({}, configuredRules, overrideRuleset);
    }
    function addToResults(result) {
      options.results.push(result);
    }

    let loadedRules = this.config.loadedRules;
    for (let ruleName in configuredRules) {
      if (configuredRules[ruleName] === false) {
        continue;
      }

      if (!loadedRules[ruleName]) {
        failures.push({
          severity: 2,
          moduleId: options.moduleId,
          filePath: options.filePath,
          message: `Definition for rule '${ruleName}' was not found`,
        });

        continue;
      }

      try {
        let rule = this._buildRule(ruleName, options, addToResults);
        rules.push(rule);
      } catch (error) {
        let message = buildErrorMessage(options.filePath, options.moduleId, error);

        failures.push(message);
      }
    }

    return {
      failures,
      rules,
    };
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

      if (typeof item === 'function' && item(moduleId)) {
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

  /**
   * Takes the source to lint and fix it. It makes use of the `verify` function.
   *
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {string} options.filePath
   * @param {string} options.moduleId
   * @param {string} options.configResolver
   * @returns {Object} result
   * @returns {boolean} result.isFixed - Whether a fix has been applied or not.
   * @returns {Object[]} result.messages - The remaining lint messages after
   * source has been fixed.
   * @returns {string} result.output - The fixed source.
   */
  verifyAndFix(options) {
    const originalSource = stripBom(options.source);

    let currentSource = originalSource;
    let shouldVerify = true;
    let iterations = 0;
    let messages = [];

    do {
      iterations++;

      options = Object.assign({}, options, { source: currentSource });
      messages = this.verify(options);
      shouldVerify = false;

      if (iterations < MAX_AUTOFIX_PASSES) {
        const output = applyFixes(options, messages);

        // let's lint one more time if source was modified
        shouldVerify = output !== currentSource;

        currentSource = output;
      }
    } while (shouldVerify);

    return {
      isFixed: currentSource !== originalSource,
      output: currentSource,
      messages,
    };
  }

  /**
   * The main function for the Linter class.  It takes the source code to lint
   * and returns the results.
   *
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {string} options.filePath
   * @param {string} options.moduleId
   * @param {string} options.configResolver
   * @returns {Object[]} results - The lint results.
   */
  verify(options) {
    let results = [];
    let pendingStatus = this.statusForModule('pending', options.moduleId);
    let shouldIgnore = this.statusForModule('ignore', options.moduleId);

    if (shouldIgnore) {
      return results;
    }

    let source = stripBom(options.source);

    let templateAST;

    try {
      templateAST = parse(source);
    } catch (error) {
      let message = buildErrorMessage(options.filePath, options.moduleId, error);
      results.push(message);
    }

    let { failures, rules } = this.buildRules({
      pending: pendingStatus,
      filePath: options.filePath,

      // TODO: deprecate moduleId and moduleName
      moduleId: options.moduleId,
      moduleName: options.moduleId,

      configResolver: options.configResolver,
      rawSource: source,
    });
    results.push(...failures);

    for (let rule of rules) {
      try {
        transform(templateAST, () => rule.getVisitor());
        results.push(...rule.results);
      } catch (error) {
        let message = buildErrorMessage(options.filePath, options.moduleId, error);
        results.push(message);
      }
    }

    if (pendingStatus) {
      if (results.length === 0) {
        results.push({
          rule: 'invalid-pending-module',
          message: `Pending module (\`${options.moduleId}\`) passes all rules. Please remove \`${options.moduleId}\` from pending list.`,
          filePath: options.filePath,
          moduleId: options.moduleId,
          severity: 2,
        });
      } else {
        if (pendingStatus.only) {
          let failedRules = results.reduce((rules, message) => rules.add(message.rule), new Set());

          pendingStatus.only.forEach(pendingRule => {
            if (!failedRules.has(pendingRule)) {
              results.push({
                rule: 'invalid-pending-module-rule',
                message: `Pending module (\`${options.moduleId}\`) passes \`${pendingRule}\` rule. Please remove \`${pendingRule}\` from pending rules list.`,
                filePath: options.filePath,
                moduleId: options.moduleId,
                severity: 2,
              });
            }
          });
        }
      }
    }

    return results;
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

  static get WARNING_SEVERITY() {
    return WARNING_SEVERITY;
  }

  static get ERROR_SEVERITY() {
    return ERROR_SEVERITY;
  }
}

module.exports = Linter;
