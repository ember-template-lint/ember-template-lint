const path = require('path');

const { parse, transform } = require('ember-template-recast');

const ModuleStatusCache = require('./-private/module-status-cache');
const TodoHandler = require('./-private/todo-handler');
const {
  getProjectConfig,
  getRuleFromString,
  WARNING_SEVERITY,
  ERROR_SEVERITY,
  IGNORE_SEVERITY,
  TODO_SEVERITY,
} = require('./get-config');
const EditorConfigResolver = require('./get-editor-config');

const MAX_AUTOFIX_PASSES = 10;

function buildErrorMessage(filePath, error) {
  let message = {
    fatal: true,
    severity: ERROR_SEVERITY,
    filePath,
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
    this.workingDir = options.workingDir || process.cwd();

    this.loadConfig();

    this.constructor = Linter;
    this.editorConfigResolver = new EditorConfigResolver(this.workingDir);
    this.editorConfigResolver.resolveEditorConfigFiles();
  }

  loadConfig() {
    this.config = getProjectConfig(this.workingDir, this.options);

    // we were passed a rule, add the rule being passed in, to the config.
    // ex:
    // rule:severity
    // no-implicit-this:["error", { "allow": ["some-helper"] }]
    if (this.options.rule) {
      const { name, config } = getRuleFromString(this.options.rule);

      this.config.rules[name] = config;
    }
    this._moduleStatusCache = new ModuleStatusCache(
      this.workingDir,
      this.config,
      this.options.configPath
    );
    this._todoHandler = new TodoHandler(this.workingDir);
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
  _buildRule(ruleName, options) {
    let fileConfig = options.fileConfig;
    let configuredRules = fileConfig.rules[ruleName];
    let Rule = fileConfig.loadedRules[ruleName];
    let pendingStatus = fileConfig.pendingStatus;
    let severity = configuredRules.severity;

    if (
      pendingStatus &&
      (pendingStatus === true || (pendingStatus.only && pendingStatus.only.includes(ruleName)))
    ) {
      severity = WARNING_SEVERITY;
    }

    let ruleOptions = Object.assign(
      {
        name: ruleName,
        config: configuredRules.config,
        console: this.console,
        defaultSeverity: severity,
        workingDir: this.workingDir,
        ruleNames: Object.keys(fileConfig.loadedRules),
        allowInlineConfig: this.options.allowInlineConfig,
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
   * @param {string} options.rawSource - The source for the file to be linted
   * @param {Object} [options.configResolver] A simple way to provide additional configuration into a rule. Currently used by plugins desiring `editorconfig` support, but to be expanded in the future
   *
   * @returns {Object} An object with an array of rule load failures, and an array of rule instances
   */
  buildRules(options) {
    let failures = [];
    let rules = [];

    let fileConfig = options.fileConfig;
    options.fileConfig = fileConfig;

    for (let ruleName in fileConfig.rules) {
      if (fileConfig.rules[ruleName].severity === IGNORE_SEVERITY) {
        continue;
      }

      if (!fileConfig.loadedRules[ruleName]) {
        failures.push({
          severity: 2,
          filePath: options.filePath,
          message: `Definition for rule '${ruleName}' was not found`,
        });

        continue;
      }

      try {
        let rule = this._buildRule(ruleName, options);
        rules.push(rule);
      } catch (error) {
        let message = buildErrorMessage(options.filePath, error);

        failures.push(message);
      }
    }

    return {
      failures,
      rules,
    };
  }

  /**
   * Takes the source to lint and fix it. It makes use of the `verify` function.
   *
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {string} options.filePath
   * @param {string} options.configResolver
   * @returns {Object} result
   * @returns {boolean} result.isFixed - Whether a fix has been applied or not.
   * @returns {Object[]} result.messages - The remaining lint messages after
   * source has been fixed.
   * @returns {string} result.output - The fixed source.
   */
  async verifyAndFix(options) {
    const originalSource = options.source;

    let hasBOM = originalSource.charCodeAt(0) === 0xfeff;
    let byteOrderMarkPrefix = hasBOM ? '\uFEFF' : '';

    let currentSource = hasBOM ? originalSource.slice(1) : originalSource;
    let shouldVerify = true;
    let iterations = 0;
    let messages = [];

    do {
      iterations++;

      options = Object.assign({}, options, { source: currentSource });
      messages = await this.verify(options);
      shouldVerify = false;

      if (iterations < MAX_AUTOFIX_PASSES) {
        const output = await this._applyFixes(options, messages);

        // let's lint one more time if source was modified
        shouldVerify = output !== currentSource;

        currentSource = output;
      }
    } while (shouldVerify);

    return {
      isFixed: currentSource !== originalSource,
      output: hasBOM ? byteOrderMarkPrefix + currentSource : currentSource,
      messages,
    };
  }

  /**
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {string} options.filePath
   * @param {Object[]} results - The lint messages.
   *
   * @returns {Promise<string>} output - The fixed source.
   */
  async _applyFixes(options, results) {
    let fixableIssues = results.filter((r) => r.isFixable);

    // nothing to do, bail out
    if (fixableIssues.length === 0) {
      return options.source;
    }

    let currentSource = options.source;
    let fileConfig = this._moduleStatusCache.getConfigForFile(options);

    let pending = fileConfig.pending;
    let ruleNames = new Set(fixableIssues.map((r) => r.rule));
    for (let ruleName of ruleNames) {
      let rule = this._buildRule(ruleName, {
        pending,
        shouldFix: true,
        filePath: options.filePath,
        rawSource: currentSource,
        fileConfig,
      });

      let visitor = await rule.getVisitor();
      let { code } = transform(currentSource, () => visitor);
      currentSource = code;
    }

    return currentSource;
  }

  _getShouldRemove(options, isOverridingConfig) {
    let config = this._moduleStatusCache.getConfigForFile(options);
    let rules = new Set(Object.keys(config.rules).filter((ruleId) => config.rules[ruleId]));

    return (todoDatum) =>
      !isOverridingConfig &&
      todoDatum.engine === 'ember-template-lint' &&
      rules.has(todoDatum.ruleId);
  }

  updateTodo(options, results, todoConfig, isOverridingConfig) {
    let todoBatchCounts = this._todoHandler.update(results, {
      filePath: options.filePath,
      todoConfig,
      // skip removing todo files if the config is overridden as this can result in todos being incorrectly removed
      shouldRemove: this._getShouldRemove(options, isOverridingConfig),
    });

    return todoBatchCounts;
  }

  processTodos(options, results, todoConfig, shouldCleanTodos, isOverridingConfig) {
    let fileResults = this._todoHandler.processResults(results, shouldCleanTodos, {
      filePath: options.filePath,
      todoConfig,
      // skip removing todo files if the config is overridden as this can result in todos being incorrectly removed
      shouldRemove: this._getShouldRemove(options, isOverridingConfig),
    });

    return fileResults;
  }

  /**
   * The main function for the Linter class.  It takes the source code to lint
   * and returns the results.
   *
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {string} options.filePath
   * @param {string} options.configResolver
   * @returns {Object[]} results - The lint results.
   */
  // temporary eslint-disable while we're implementing the new pending feature (which requires async/await)
  async verify(options) {
    let results = [];
    let fileConfig = this._moduleStatusCache.getConfigForFile(options);
    let pendingStatus = fileConfig.pendingStatus;

    if (fileConfig.shouldIgnore) {
      return results;
    }

    let hasBOM = options.source.charCodeAt(0) === 0xfeff;
    let source = hasBOM ? options.source.slice(1) : options.source;

    let templateAST;

    try {
      templateAST = parse(source);
    } catch (error) {
      let message = buildErrorMessage(options.filePath, error);
      results.push(message);
      return results;
    }

    let { failures, rules } = this.buildRules({
      fileConfig,
      pending: pendingStatus,
      filePath: options.filePath,
      configResolver: options.configResolver,
      rawSource: source,
    });
    results.push(...failures);

    for (let rule of rules) {
      try {
        let visitor = await rule.getVisitor();
        transform(templateAST, () => visitor);
        results.push(...rule.results);
      } catch (error) {
        let message = buildErrorMessage(options.filePath, error);
        results.push(message);
      }
    }

    if (pendingStatus) {
      let moduleId = options.filePath.slice(0, -path.extname(options.filePath).length);

      if (results.length === 0) {
        results.push({
          rule: 'invalid-pending-module',
          message: `Pending module (\`${moduleId}\`) passes all rules. Please remove \`${moduleId}\` from pending list.`,
          filePath: options.filePath,
          severity: 2,
        });
      } else {
        if (pendingStatus.only) {
          let failedRules = results.reduce((rules, message) => rules.add(message.rule), new Set());

          for (const pendingRule of pendingStatus.only) {
            if (!failedRules.has(pendingRule)) {
              results.push({
                rule: 'invalid-pending-module-rule',
                message: `Pending module (\`${moduleId}\`) passes \`${pendingRule}\` rule. Please remove \`${pendingRule}\` from pending rules list.`,
                filePath: options.filePath,
                severity: 2,
              });
            }
          }
        }
      }
    }

    return results;
  }

  getConfigForFile(options) {
    let fileConfig = {
      ...this._moduleStatusCache.getConfigForFile(options),
      loadedConfigurations: undefined,
      _processed: undefined,
      shouldIgnore: undefined,
    };

    return fileConfig;
  }

  // this should eventually be removed but is currently still used by ember-cli-template-lint
  static errorsToMessages(filePath, errors, options) {
    errors = errors || [];
    options = options || {
      verbose: false,
    };

    let PrettyPrinter = require('./formatters/pretty');
    return PrettyPrinter.errorsToMessages(filePath, errors, options);
  }

  static get TODO_SEVERITY() {
    return TODO_SEVERITY;
  }

  static get WARNING_SEVERITY() {
    return WARNING_SEVERITY;
  }

  static get ERROR_SEVERITY() {
    return ERROR_SEVERITY;
  }
}

module.exports = Linter;
