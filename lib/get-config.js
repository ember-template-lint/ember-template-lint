'use strict';

const path = require('path');

const chalk = require('chalk');
const findUp = require('find-up');
const micromatch = require('micromatch');
const resolve = require('resolve');

const defaultConfigurations = require('./config');
const DEPRECATED_RULES = require('./helpers/deprecated-rules');
const defaultRules = require('./rules');

const KNOWN_ROOT_PROPERTIES = new Set([
  'extends',
  'rules',
  'pending',
  'ignore',
  'plugins',
  'overrides',
]);
const SUPPORTED_OVERRIDE_KEYS = new Set(['files', 'rules']);
// Severity level definitions
const TODO_SEVERITY = -1;
const IGNORE_SEVERITY = 0;
const WARNING_SEVERITY = 1;
const ERROR_SEVERITY = 2;

const CONFIG_FILE_NAME = '.template-lintrc.js';
const ALLOWED_ERROR_CODES = new Set([
  // resolve package error codes
  'MODULE_NOT_FOUND',

  // Yarn PnP Error Code
  'QUALIFIED_PATH_RESOLUTION_FAILED',
]);

function requirePlugin(workingDir, pluginName, fromConfigPath) {
  let basedir = fromConfigPath === undefined ? workingDir : path.dirname(fromConfigPath);

  // throws exception if not found
  let pluginPath = resolve.sync(pluginName, { basedir });

  return require(pluginPath); // eslint-disable-line import/no-dynamic-require
}

function resolveProjectConfig(workingDir, options) {
  let configPath;

  if (options.configPath) {
    configPath = path.resolve(workingDir, options.configPath);

    try {
      // Making sure that the filePath exists, before requiring it directly this is
      // needed in order to ensure that we only squelch module missing errors for
      // the config path itself (and not other files that the config path may
      // require itself)
      require.resolve(configPath);
    } catch (error) {
      let isModuleMissingError = ALLOWED_ERROR_CODES.has(error.code);
      if (!isModuleMissingError) {
        throw error;
      }

      throw new Error(
        `The configuration file specified (${options.configPath}) could not be found. Aborting.`
      );
    }
  } else if (options.configPath === false) {
    // we are explicitly using `--no-config-path` flag
    return {};
  } else {
    // look for our config file relative to the specified working directory
    configPath = findUp.sync(CONFIG_FILE_NAME, {
      cwd: workingDir,
    });

    if (configPath === undefined) {
      // we weren't given an explicit --config-path argument, and we couldn't
      // find a relative .template-lintrc.js file, just use the default "empty" config
      return {};
    }
  }

  options.resolvedConfigPath = configPath;

  return require(configPath); // eslint-disable-line import/no-dynamic-require
}

function forEachPluginConfiguration(plugins, callback) {
  if (!plugins) {
    return;
  }

  for (let pluginName in plugins) {
    let pluginConfigurations = plugins[pluginName].configurations;
    if (!pluginConfigurations) {
      continue;
    }

    for (let configurationName in pluginConfigurations) {
      let configuration = pluginConfigurations[configurationName];

      callback(configuration, configurationName, pluginName);
    }
  }
}

function normalizeExtends(config, options) {
  let logger = options.console || console;

  let extendedList = [];
  if (config.extends) {
    if (typeof config.extends === 'string') {
      extendedList = [config.extends];
    } else if (Array.isArray(config.extends)) {
      extendedList = [...config.extends];
    } else {
      logger.log(chalk.yellow('config.extends should be string or array '));
    }
  }
  return extendedList;
}

function ensureRootProperties(config, source) {
  config.rules = Object.assign({}, source.rules || {});
  config.pending = [...(source.pending || [])];
  config.overrides = [...(source.overrides || [])];
  config.ignore = [...(source.ignore || [])];
  config.extends = source.extends;
}

function migrateRulesFromRoot(config, source, options) {
  let logger = options.console || console;

  let invalidKeysFound = [];
  for (let key in source) {
    if (!KNOWN_ROOT_PROPERTIES.has(key)) {
      invalidKeysFound.push(key);

      config.rules[key] = source[key];
    }
  }

  if (invalidKeysFound.length > 0) {
    logger.log(
      chalk.yellow(
        `
        Rule configuration has been moved into a \`rules\` property.
        Please update your \`${CONFIG_FILE_NAME}\` file.
        The following rules have been migrated to the \`rules\`
        property: ${invalidKeysFound}.
        `
      )
    );
  }
}

function processPlugins(workingDir, plugins = [], options, checkForCircularReference) {
  let logger = options.console || console;

  let pluginsHash = {};

  for (let plugin of plugins) {
    let pluginName;

    if (typeof plugin === 'string') {
      pluginName = plugin;
      // the second argument here should actually be the config file path for
      // the _currently being processed_ config file (not neccesarily the one
      // specified to the bin script)
      plugin = requirePlugin(workingDir, pluginName, options.resolvedConfigPath);
    }

    let errorMessage;
    if (typeof plugin === 'object') {
      if (plugin.name) {
        if (!checkForCircularReference || !checkForCircularReference[plugin.name]) {
          pluginsHash[plugin.name] = plugin;
        }
      } else if (pluginName) {
        errorMessage = `Plugin (${pluginName}) has not defined the plugin \`name\` property`;
      } else {
        errorMessage = 'Inline plugin object has not defined the plugin `name` property';
      }
    } else if (pluginName) {
      errorMessage = `Plugin (${pluginName}) did not return a plain object`;
    } else {
      errorMessage = 'Inline plugin is not a plain object';
    }

    if (errorMessage) {
      logger.log(chalk.yellow(errorMessage));
    }
  }

  forEachPluginConfiguration(pluginsHash, (configuration) => {
    // process plugins recursively
    Object.assign(
      pluginsHash,
      processPlugins(workingDir, configuration.plugins, options, pluginsHash)
    );
  });

  return pluginsHash;
}

function processLoadedRules(workingDir, config, options) {
  let loadedRules;
  if (config.loadedRules) {
    loadedRules = config.loadedRules;
  } else {
    // load all the default rules in `ember-template-lint`
    loadedRules = Object.assign({}, defaultRules);
  }

  // load plugin rules
  for (let pluginName in config.plugins) {
    let pluginRules = config.plugins[pluginName].rules;
    if (pluginRules) {
      loadedRules = Object.assign(loadedRules, pluginRules);
    }
  }

  forEachPluginConfiguration(config.plugins, (configuration) => {
    let plugins = processPlugins(workingDir, configuration.plugins, options, config.plugins);
    // process plugins recursively
    processLoadedRules(workingDir, { plugins, loadedRules });
  });

  return loadedRules;
}

function processLoadedConfigurations(workingDir, config, options) {
  let loadedConfigurations;
  if (config.loadedConfigurations) {
    loadedConfigurations = config.loadedConfigurations;
  } else {
    // load all the default configurations in `ember-template-lint`
    loadedConfigurations = Object.assign({}, defaultConfigurations);
  }

  forEachPluginConfiguration(config.plugins, (configuration, configurationName, pluginName) => {
    let name = `${pluginName}:${configurationName}`;
    loadedConfigurations[name] = configuration;

    // load plugins recursively
    let plugins = processPlugins(workingDir, configuration.plugins, options, config.plugins);
    processLoadedConfigurations(workingDir, { plugins, loadedConfigurations }, options);
  });

  return loadedConfigurations;
}

function processExtends(config, options) {
  let logger = options.console || console;

  let extendedList = normalizeExtends(config, options);
  let extendedRules = {};

  if (extendedList) {
    for (const extendName of extendedList) {
      let configuration = config.loadedConfigurations[extendName];
      if (configuration) {
        // ignore loops
        if (!configuration.loadedConfigurations) {
          configuration.loadedConfigurations = config.loadedConfigurations;

          // continue chaining `extends` from plugins until done
          processExtends(configuration, options);

          delete configuration.loadedConfigurations;

          if (configuration.rules) {
            extendedRules = Object.assign({}, extendedRules, configuration.rules);
          } else {
            logger.log(chalk.yellow(`Missing rules for extends: ${extendName}`));
          }
        }
      } else {
        logger.log(chalk.yellow(`Cannot find configuration for extends: ${extendName}`));
      }

      delete config.extends;
    }

    config.rules = Object.assign({}, extendedRules, config.rules);
  }
}

function processIgnores(config) {
  config.ignore = config.ignore.map((pattern) => micromatch.matcher(pattern));
}

/**
 * we were passed a rule, add the rule being passed in, to the config.
 * ex:
 * rule:severity
 * no-implicit-this:["error", { "allow": ["some-helper"] }]
 */
function getRuleFromString(rule) {
  const indexOfSeparator = rule.indexOf(':') + 1;

  // we have to split based on the index of the first instance of the separator because the separator could exist in the second half of the rule
  const name = rule.substring(0, indexOfSeparator - 1); // eslint-disable-line unicorn/prefer-string-slice
  let ruleConfig = rule.substring(indexOfSeparator); // eslint-disable-line unicorn/prefer-string-slice

  if (ruleConfig.startsWith('[')) {
    try {
      ruleConfig = JSON.parse(ruleConfig);
    } catch {
      throw new Error(`Error parsing specified \`--rule\` config ${rule} as JSON.`);
    }
  }

  const config = determineRuleConfig(ruleConfig);

  return { name, config };
}

function validateRules(rules, loadedRules, options) {
  let logger = options.console || console;
  let invalidKeysFound = [];
  let deprecatedNamesFound = [];

  for (let key in rules) {
    if (!loadedRules[key]) {
      const deprecation = DEPRECATED_RULES.get(key);
      if (deprecation) {
        deprecatedNamesFound.push({ oldName: key, newName: deprecation });
        rules[deprecation] = rules[key];
        delete rules[key];
      } else {
        invalidKeysFound.push(key);
      }
    }
  }

  if (invalidKeysFound.length > 0) {
    logger.log(chalk.yellow(`Invalid rule configuration found: ${invalidKeysFound}`));
  }
  if (deprecatedNamesFound.length > 0) {
    logger.log(
      chalk.yellow(`Deprecated rule names found: ${JSON.stringify(deprecatedNamesFound, null, 4)}`)
    );
  }
}

function validateOverrides(config, options) {
  if (config.overrides) {
    config.overrides = config.overrides.map((overrideConfig) => {
      // If there are keys in the object which are not yet supported by overrides functionality, throw an error.
      let overrideKeys = Object.keys(overrideConfig);
      let containsValidKeys = overrideKeys.every((item) => SUPPORTED_OVERRIDE_KEYS.has(item));
      if (!containsValidKeys) {
        throw new Error(
          'Using `overrides` in `.template-lintrc.js` only supports `files` and `rules` sections. Please update your configuration.'
        );
      }

      // clone a deep copy of the override config to ensure it is not mutated
      let clonedResult = JSON.parse(JSON.stringify(overrideConfig));

      // TODO: this should be updated to avoid mutation (mutates for deprecated rules), and the mutation should be moved into `processRules` which is expected to return a new value
      validateRules(clonedResult.rules, config.loadedRules, options);

      clonedResult.rules = processRules(clonedResult);

      return clonedResult;
    });
  }
}

function _determineConfigForSeverity(config) {
  switch (config) {
    case 'off':
      return { config: false, severity: IGNORE_SEVERITY };
    case 'warn':
      return { config: true, severity: WARNING_SEVERITY };
    case 'error':
      return { config: true, severity: ERROR_SEVERITY };
  }
}

function determineRuleConfig(ruleData) {
  let ruleConfig = {
    severity: ruleData === false ? IGNORE_SEVERITY : ERROR_SEVERITY,
    config: ruleData,
  };
  let severityConfig;
  // In case of {'no-implicit-this': 'off|warn|error'}
  if (typeof ruleData === 'string') {
    severityConfig = _determineConfigForSeverity(ruleData);
    if (severityConfig) {
      ruleConfig = severityConfig;
    }
  } else if (Array.isArray(ruleData)) {
    // array of severity and custom rule config
    let severity = ruleData[0];
    severityConfig = _determineConfigForSeverity(severity);
    if (severityConfig) {
      ruleConfig.severity = severityConfig.severity;
      ruleConfig.config = ruleData[1];
    }
  }
  return ruleConfig;
}
/**
 * Sets the severity and config on the rule object.
 * Eg:
 * {'no-implicit-this': 'warn'} -> {'no-implicit-this': { severity: 'warn', config: true }}
 * { 'no-implicit-this': [ 'warn', { allow: [ 'fooData' ] } ] }
 * would become:
 * { 'no-implicit-this': { severity: 'warn', config: 'allow': [ 'fooData' ] } }
 * {
 *  'some-rule': 'lol',                   // -> { severity: 2, config: 'lol' }
 *  'other-thing': ['wat', 'is', 'this'], // { severity: 2, config: ['wat', 'is', 'this'] }
 *  'hmm-thing-here': { zomg: 'lol' },    // -> { severity: 2, config: { zomg: 'lol' } }
 *  'another-thing-there': 'off',    // -> { severity: 0, config: false }
 * }
 * @param {*} configData
 */
function processRules(config) {
  let processedRules = Object.assign({}, config.rules);

  for (let key in processedRules) {
    let ruleData = processedRules[key];
    processedRules[key] = determineRuleConfig(ruleData);
  }
  return processedRules;
}

function getProjectConfig(workingDir, options) {
  let source = options.config || resolveProjectConfig(workingDir, options);
  let config;

  if (source._processed) {
    config = source;
  } else {
    // don't mutate a `require`d object, you'll have a bad time
    config = {};

    ensureRootProperties(config, source);
    migrateRulesFromRoot(config, source, options);

    config.plugins = processPlugins(workingDir, source.plugins, options);
    config.loadedRules = processLoadedRules(workingDir, config, options);
    config.loadedConfigurations = processLoadedConfigurations(workingDir, config, options);
    processExtends(config, options);
    processIgnores(config);

    validateRules(config.rules, config.loadedRules, options);
    validateOverrides(config, options);
    config.rules = processRules(config);

    config._processed = true;
  }

  return config;
}

module.exports = {
  ERROR_SEVERITY,
  IGNORE_SEVERITY,
  WARNING_SEVERITY,
  TODO_SEVERITY,
  getProjectConfig,
  getRuleFromString,
  resolveProjectConfig,
  determineRuleConfig,
  processRules,
};
