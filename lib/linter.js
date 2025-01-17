import { parse, transform } from 'ember-template-recast';

import ModuleStatusCache from './-private/module-status-cache.js';
import TodoHandler from './-private/todo-handler.js';
import { extractTemplates, coordinatesOfResult } from './extract-templates.js';
import PrettyFormatter from './formatters/pretty.js';
import { getProjectConfig, getRuleFromString } from './get-config.js';
import EditorConfigResolver from './get-editor-config.js';
import {
  WARNING_SEVERITY,
  ERROR_SEVERITY,
  IGNORE_SEVERITY,
  TODO_SEVERITY,
} from './helpers/severity.js';

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

export default class Linter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
    this.workingDir = options.workingDir || process.cwd();
  }

  /**
   * Load the config. Since this is async, it will called automatically when public methods of this class are called.
   */
  async loadConfig() {
    this.config = await getProjectConfig(this.workingDir, this.options);

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

    this.editorConfigResolver = new EditorConfigResolver(this.workingDir);
    this.editorConfigResolver.resolveEditorConfigFiles();
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
    let severity = configuredRules.severity;

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

    let hasBOM = originalSource.codePointAt(0) === 0xfe_ff;
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
    let currentSource = options.source;
    let fixableIssues = results.filter((r) => r.isFixable);

    // nothing to do, bail out
    if (fixableIssues.length === 0) {
      return currentSource;
    }

    let fileConfig = this._moduleStatusCache.getConfigForFile(options);

    let ruleNames = new Set(fixableIssues.map((r) => r.rule));

    for (let ruleName of ruleNames) {
      let templateInfos = extractTemplates(currentSource, options.filePath);

      for (let templateInfo of templateInfos) {
        let { templateMatch } = templateInfo;

        let rule = this._buildRule(ruleName, {
          shouldFix: true,
          filePath: options.filePath,
          columnOffset: templateInfo.columnOffset,
          rawSource: templateInfo.template,
          isStrictMode: templateInfo.isStrictMode,
          isEmbedded: templateInfo.isEmbedded,
          fileConfig,
        });

        let visitor = await rule.getVisitor();
        let { code } = transform(templateInfo.template, () => visitor);

        if (code !== templateInfo.template) {
          let prefix;
          if (!templateInfo.templateMatch) {
            // this is a `.hbs` file, no prefix needed
            prefix = '';
          } else if (templateInfo.templateMatch.type === 'template-tag') {
            // handing `<template></template>`
            let { start } = templateMatch;

            prefix = currentSource.slice(start.index, start.index + start[0].length);
          } else {
            // handling things like hbs`Hello!`
            prefix = `${templateMatch.tagName}\``;
          }

          // if there is no prefix we don't need to slice anything, just use the code output by transform
          currentSource = prefix
            ? currentSource.slice(0, templateInfo.start) +
              prefix +
              code +
              currentSource.slice(templateInfo.end)
            : code;

          return await this._applyFixes(
            {
              ...options,
              source: currentSource,
            },
            results
          );
        }
      }
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
      engine: 'ember-template-lint',
      filePath: options.filePath,
      todoConfig,
      // skip removing todo files if the config is overridden as this can result in todos being incorrectly removed
      shouldRemove: this._getShouldRemove(options, isOverridingConfig),
    });

    return todoBatchCounts;
  }

  processTodos(options, results, todoConfig, shouldCleanTodos, isOverridingConfig) {
    let fileResults = this._todoHandler.processResults(results, shouldCleanTodos, {
      engine: 'ember-template-lint',
      filePath: options.filePath,
      todoConfig,
      // skip removing todo files if the config is overridden as this can result in todos being incorrectly removed
      shouldRemove: this._getShouldRemove(options, isOverridingConfig),
    });

    return fileResults;
  }

  async getConfig() {
    if (!this.config) {
      await this.loadConfig();
    }
    return this.config;
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
  async verify(options) {
    if (!this.config) {
      await this.loadConfig();
    }

    let results = [];
    let fileConfig = this._moduleStatusCache.getConfigForFile(options);

    if (fileConfig.shouldIgnore) {
      return results;
    }

    let hasBOM = options.source.codePointAt(0) === 0xfe_ff;
    let source = hasBOM ? options.source.slice(1) : options.source;

    let templateInfos = extractTemplates(source, options.filePath);

    for (let templateInfo of templateInfos) {
      let templateAST;

      try {
        templateAST = parse(templateInfo.template);
      } catch (error) {
        let message = buildErrorMessage(options.filePath, error);
        results.push(message);
        return results;
      }

      let { failures, rules } = this.buildRules({
        fileConfig,
        filePath: options.filePath,
        configResolver: options.configResolver,
        columnOffset: templateInfo.columnOffset,
        rawSource: templateInfo.template,
        isStrictMode: templateInfo.isStrictMode,
        isEmbedded: templateInfo.isEmbedded,
      });
      results.push(...failures);

      for (let rule of rules) {
        try {
          let visitor = await rule.getVisitor();
          transform(templateAST, () => visitor);

          // apply offsets for embedded templates
          if (templateInfo.isEmbedded) {
            for (let result of rule.results) {
              const resultCoordinates = coordinatesOfResult(templateInfo, result);
              result.line = resultCoordinates.line;
              result.endLine = resultCoordinates.endLine;
              result.column = resultCoordinates.column;
              result.endColumn = resultCoordinates.endColumn;
            }
          }

          results.push(...rule.results);
        } catch (error) {
          let message = buildErrorMessage(options.filePath, error);
          results.push(message);
        }
      }
    }

    return results;
  }

  async getConfigForFile(options) {
    if (!this.config) {
      await this.loadConfig();
    }
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

    return PrettyFormatter.errorsToMessages(filePath, errors, options);
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
