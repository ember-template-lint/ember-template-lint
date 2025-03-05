import { parse, transform } from 'ember-template-recast';
import * as contentTagUtils from 'content-tag-utils';

import { canProcessFile, processFile } from './-private/file-path.js';
import ModuleStatusCache from './-private/module-status-cache.js';
import TodoHandler from './-private/todo-handler.js';
import {
  templateInfoForTemplateFile,
  templateInfoForScript,
  asyncMapOverTemplatesInScript,
  reverseInnerCoordinatesOf,
} from './template-info.js';
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
const DEFAULT_FILE_NAME = './fallback-or-is-from-stdin.hbs';

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

const DEFAULT_OPTIONS = {
  /**
   * TODO: Will be false in the next major
   *       currently true by default for compat
   */
  checkHbsTemplateLiterals: true,
};

function getOptionWithDefault(options, name) {
  return options[name] ?? DEFAULT_OPTIONS[name];
}

function isHbsTemplateInScriptCheckingEnabled(options) {
  return getOptionWithDefault(options, 'checkHbsTemplateLiterals');
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
        reportUnusedDisableDirectives: this.options.reportUnusedDisableDirectives,
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

  #byType = {
    // js + ts
    script: {
      check: async (source, options, fileConfig) => {
        // early exit if we don't have imports from ember-cli-htmlbars
        // this is a small speed boost for js/ts that don't define templates.
        if (!source.includes('ember-cli-htmlbars')) {
          return [];
        }

        let results = [];
        let templateInfos = [];

        try {
          templateInfos = templateInfoForScript(source);
        } catch (error) {
          let message = buildErrorMessage(options.filePath, error);
          results.push(message);
          return results;
        }

        for (let templateInfo of templateInfos) {
          let templateResults = await this._verifyTemplate(templateInfo, options, fileConfig);

          results.push(...templateResults);
        }

        return results;
      },
      fix: (ruleNames, options, fileConfig) => {
        return asyncMapOverTemplatesInScript(options.source, async (source, coordinates) => {
          let currentSource = source;

          for (let ruleName of ruleNames) {
            let rule = this._buildRule(ruleName, {
              shouldFix: true,
              filePath: options.filePath,
              columnOffset: coordinates.columnOffset,
              rawSource: source,
              isStrictMode: true,
              isEmbedded: true,
              fileConfig,
            });

            let visitor = await rule.getVisitor();
            let { code } = transform(currentSource, () => visitor);

            currentSource = code;
          }

          return currentSource;
        });
      },
    },
    // hbs
    template: {
      check: async (source, options, fileConfig) => {
        let templateInfo = templateInfoForTemplateFile(source);

        return await this._verifyTemplate(templateInfo, options, fileConfig);
      },
      fix: async (ruleNames, options, fileConfig) => {
        let currentSource = options.source;

        for (let ruleName of ruleNames) {
          let rule = this._buildRule(ruleName, {
            shouldFix: true,
            filePath: options.filePath,
            columnOffset: 0,
            rawSource: currentSource,
            isStrictMode: false,
            fileConfig,
          });

          let visitor = await rule.getVisitor();
          let { code } = transform(currentSource, () => visitor);
          currentSource = code;
        }

        return currentSource;
      },
    },
    // gjs + gts
    glimmerScript: {
      check: async (source, options, fileConfig) => {
        // early exit if we don't have </template>
        // this is a small speed boost for gjs/gts that don't define components.
        if (!source.includes('</template>')) {
          return [];
        }

        let results = [];

        let transformer;
        try {
          transformer = new contentTagUtils.Transformer(source);
        } catch (error) {
          let message = buildErrorMessage(options.filePath, error);
          results.push(message);
          return results;
        }

        await transformer.asyncEach(async (template, coordinates) => {
          let templateResults = await this._verifyTemplate(
            {
              line: coordinates.line,
              column: coordinates.column,
              template,
              isEmbedded: true,
              isStrictMode: true,
              transformer,
              coordinates,
            },
            options,
            fileConfig
          );

          results.push(...templateResults);
        });

        return results;
      },
      fix: async (ruleNames, options, fileConfig) => {
        let t = new contentTagUtils.Transformer(options.source);

        await t.asyncMap(async (source, coordinates) => {
          let currentSource = source;

          for (let ruleName of ruleNames) {
            let rule = this._buildRule(ruleName, {
              shouldFix: true,
              filePath: options.filePath,
              columnOffset: coordinates.columnOffset,
              rawSource: source,
              isStrictMode: true,
              isEmbedded: true,
              fileConfig,
            });

            let visitor = await rule.getVisitor();
            let { code } = transform(currentSource, () => visitor);

            currentSource = code;
          }

          return currentSource;
        });

        return t.toString();
      },
    },
  };

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

    let filePath = options.filePath;
    let fileConfig = this._moduleStatusCache.getConfigForFile(options);
    let ruleNames = new Set(fixableIssues.map((r) => r.rule));

    return await processFile(filePath, {
      default: () => {
        return currentSource;
      },
      glimmerScript: async () => {
        return await this.#byType.glimmerScript.fix(ruleNames, options, fileConfig);
      },
      script: async () => {
        if (!isHbsTemplateInScriptCheckingEnabled(options)) {
          return currentSource;
        }

        return await this.#byType.script.fix(ruleNames, options, fileConfig);
      },
      template: () => {
        return this.#byType.template.fix(ruleNames, options, fileConfig);
      },
    });
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

    let fileConfig = this._moduleStatusCache.getConfigForFile(options);

    if (fileConfig.shouldIgnore) {
      return [];
    }

    let filePath = canProcessFile(options.filePath) ? options.filePath : DEFAULT_FILE_NAME;
    let hasBOM = options.source.codePointAt(0) === 0xfe_ff;
    let source = hasBOM ? options.source.slice(1) : options.source;

    return processFile(filePath, {
      default: () => {
        return [];
      },
      glimmerScript: () => {
        return this.#byType.glimmerScript.check(source, options, fileConfig);
      },
      script: () => {
        if (!isHbsTemplateInScriptCheckingEnabled(options)) {
          return [];
        }

        return this.#byType.script.check(source, options, fileConfig);
      },
      template: () => {
        return this.#byType.template.check(source, options, fileConfig);
      },
    });
  }

  /**
   *
   * @param {import('./template-info.js').TemplateInfo} templateInfo
   * @param {*} options
   * @param {*} fileConfig
   * @returns
   */
  async _verifyTemplate(templateInfo, options, fileConfig) {
    let results = [];

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

        // apply offsets for embedded templates (gjs/gts)
        if (templateInfo.isStrictMode) {
          let { transformer, coordinates } = templateInfo;
          let key = transformer.parseResultAt(coordinates);

          for (let result of rule.results) {
            const resultCoordinates = templateInfo.transformer.reverseInnerCoordinatesOf(
              key,
              result
            );
            result.line = resultCoordinates.line;
            result.endLine = resultCoordinates.endLine;
            result.column = resultCoordinates.column;
            result.endColumn = resultCoordinates.endColumn;
          }
        }

        // apply offsets for embedded templates (js/ts w/ hbs)
        if (templateInfo.isEmbedded && !templateInfo.isStrictMode) {
          for (let result of rule.results) {
            const resultCoordinates = reverseInnerCoordinatesOf(templateInfo, result);

            Object.assign(result, resultCoordinates);
          }
        }

        results.push(...rule.results);
      } catch (error) {
        let message = buildErrorMessage(options.filePath, error);
        results.push(message);
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
