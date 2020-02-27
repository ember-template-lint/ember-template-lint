'use strict';

const path = require('path');
const resolve = require('resolve');
const chalk = require('chalk');
const micromatch = require('micromatch');
const findUp = require('find-up');
const defaultRules = require('./rules');
const defaultConfigurations = require('./config/index');
const DEPRECATED_RULES = require('./helpers/deprecated-rules');

const KNOWN_ROOT_PROPERTIES = ['extends', 'rules', 'pending', 'ignore', 'plugins', 'overrides'];
const SUPPORTED_OVERRIDE_KEYS = ['files', 'rules'];
// Severity level definitions
const IGNORE_SEVERITY = 0;
const WARNING_SEVERITY = 1;
const ERROR_SEVERITY = 2;

const CONFIG_FILE_NAME = '.template-lintrc.js';
const ALLOWED_ERROR_CODES = [
  // resolve package error codes
  'MODULE_NOT_FOUND',

  // Yarn PnP Error Code
  'QUALIFIED_PATH_RESOLUTION_FAILED',
];

function requirePlugin(pluginName, fromConfigPath) {
  let pluginPath;

  function getPluginPath(name) {
    let basedir = fromConfigPath === undefined ? process.cwd() : path.dirname(fromConfigPath);
    return resolve.sync(name, { basedir });
  }

  // attemps to find the plugin by its name
  try {
    pluginPath = getPluginPath(pluginName);
  } catch (e) {
    let isModuleMissingError = ALLOWED_ERROR_CODES.includes(e.code);
    if (!isModuleMissingError) {
      throw e;
    }

    // attemps to find the plugin its name prefixed with `ember-template-lint-plugin`
    // throws exception if not found
    try {
      pluginPath = getPluginPath(`ember-template-lint-plugin-${pluginName}`);
    } catch (e) {
      let isModuleMissingError = ALLOWED_ERROR_CODES.includes(e.code);
      if (!isModuleMissingError) {
        throw e;
      }

      throw new Error(`The plugin (${pluginName}) could not be found. Aborting.`);
    }
  }

  return require(pluginPath); // eslint-disable-line import/no-dynamic-require
}

function resolveProjectConfig(options) {
  let configPath;

  if (options.configPath) {
    configPath = path.resolve(process.cwd(), options.configPath);

    try {
      // Making sure that the filePath exists, before requiring it directly this is
      // needed in order to ensure that we only squelch module missing errors for
      // the config path itself (and not other files that the config path may
      // require itself)
      require.resolve(configPath);
    } catch (e) {
      let isModuleMissingError = ALLOWED_ERROR_CODES.includes(e.code);
      if (!isModuleMissingError) {
        throw e;
      }

      throw new Error(
        `The configuration file specified (${options.configPath}) could not be found. Aborting.`
      );
    }
  } else {
    configPath = findUp.sync(CONFIG_FILE_NAME);

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
      extendedList = config.extends.slice();
    } else {
      logger.log(chalk.yellow('config.extends should be string or array '));
    }
  }
  return extendedList;
}

function ensureRootProperties(config, source) {
  config.rules = Object.assign({}, source.rules || {});
  config.pending = (source.pending || []).slice();
  config.overrides = (source.overrides || []).slice();
  config.ignore = (source.ignore || []).slice();
  config.plugins = (source.plugins || []).slice();
  config.extends = source.extends;
}

function migrateRulesFromRoot(config, source, options) {
  let logger = options.console || console;

  let invalidKeysFound = [];
  for (let key in source) {
    if (KNOWN_ROOT_PROPERTIES.indexOf(key) === -1) {
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

function processPlugins(config, options, checkForCircularReference) {
  let logger = options.console || console;

  let configPlugins = config.plugins;
  let pluginsHash = {};

  if (configPlugins) {
    for (let i = 0; i < configPlugins.length; i++) {
      let plugin = configPlugins[i];
      let pluginName;

      if (typeof plugin === 'string') {
        pluginName = plugin;
        // the second argument here should actually be the config file path for
        // the _currently being processed_ config file (not neccesarily the one
        // specified to the bin script)
        plugin = requirePlugin(pluginName, options.resolvedConfigPath);
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
  }

  forEachPluginConfiguration(pluginsHash, configuration => {
    // process plugins recursively
    Object.assign(pluginsHash, processPlugins(configuration, options, pluginsHash));
  });

  config.plugins = pluginsHash;

  return pluginsHash;
}

function processLoadedRules(config) {
  let loadedRules;
  if (config.loadedRules) {
    loadedRules = config.loadedRules;
  } else {
    // load all the default rules in `ember-template-lint`
    loadedRules = Object.assign({}, defaultRules);
  }

  // load plugin rules
  for (let name in config.plugins) {
    let pluginRules = config.plugins[name].rules;
    if (pluginRules) {
      loadedRules = Object.assign(loadedRules, pluginRules);
    }
  }

  forEachPluginConfiguration(config.plugins, configuration => {
    // process plugins recursively
    processLoadedRules({
      plugins: configuration.plugins,
      loadedRules,
    });
  });

  config.loadedRules = loadedRules;
}

function processLoadedConfigurations(config) {
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
    processLoadedConfigurations({
      plugins: configuration.plugins,
      loadedConfigurations,
    });
  });

  config.loadedConfigurations = loadedConfigurations;
}

function processExtends(config, options) {
  let logger = options.console || console;

  let extendedList = normalizeExtends(config, options);

  if (extendedList) {
    for (let i = 0; i < extendedList.length; i++) {
      let extendName = extendedList[i];

      let configuration = config.loadedConfigurations[extendName];
      if (configuration) {
        // ignore loops
        if (!configuration.loadedConfigurations) {
          configuration.loadedConfigurations = config.loadedConfigurations;

          // continue chaining `extends` from plugins until done
          processExtends(configuration, options);

          delete configuration.loadedConfigurations;

          if (configuration.rules) {
            config.rules = Object.assign({}, configuration.rules, config.rules);
          } else {
            logger.log(chalk.yellow(`Missing rules for extends: ${extendName}`));
          }
        }
      } else {
        logger.log(chalk.yellow(`Cannot find configuration for extends: ${extendName}`));
      }

      delete config.extends;
    }
  }
}

function processIgnores(config) {
  config.ignore = config.ignore.map(pattern => micromatch.matcher(pattern));
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
    for (const overrideConfig of config.overrides) {
      // If there are keys in the object which are not yet supported by overrides functionality, throw an error.
      const overrideKeys = Object.keys(overrideConfig);
      const containsValidKeys = overrideKeys.every(item => SUPPORTED_OVERRIDE_KEYS.includes(item));
      if (!containsValidKeys) {
        throw new Error(
          'Using `overrides` in `.template-lintrc.js` only supports `files` and `rules` sections. Please update your configuration.'
        );
      }
      validateRules(overrideConfig.rules, config.loadedRules, options);
      processRules(overrideConfig);
    }
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

/**
 * Returns the config in conjunction with overrides configuration.
 * @param {*} config
 * @param {*} filePath
 */
function getConfigForFile(config, filePath) {
  let configuredRules = config.rules;
  let overrides = config.overrides;
  if (filePath && overrides) {
    let overridesRules = {};
    overrides.forEach(override => {
      const isFileMatch = override.files && micromatch.isMatch(filePath, override.files);
      if (isFileMatch) {
        overridesRules = Object.assign(overridesRules, override.rules);
      }
    });
    // If there is an override present, then the overridden ruleset takes precedence.
    config = Object.assign({}, config, {
      rules: Object.assign({}, configuredRules, overridesRules),
    });
  }
  return config;
}

/**
 * Sets the severity and config on the rule object.
 * Eg:
 * {'no-implicit-this': 'warn'} -> {'no-implicit-this': { severity: 'warn', config: true }}
 * { 'no-implicit-this': [ 'warn', { allow: [ 'fooData' ] } ] }
 * would become:
 * { 'no-implicit-this': { severity: 'warn', config: 'allow': [ 'fooData' ] } }
 * @param {*} configData
 */
function processRules(config) {
  for (let key in config.rules) {
    let severityConfig;
    let ruleData = config.rules[key];
    // defaults to error always.
    let ruleConfig = {
      severity: ruleData === false ? IGNORE_SEVERITY : ERROR_SEVERITY,
      config: ruleData,
    };
    // In case of {'no-implicit-this': 'off|warn|error'}
    if (typeof ruleData === 'string') {
      severityConfig = _determineConfigForSeverity(ruleData);
      if (severityConfig) {
        ruleConfig.severity = severityConfig.severity;
        ruleConfig.config = severityConfig.config;
      }
    } else if (Array.isArray(ruleData)) {
      // array of severity and custom rule config
      let severity = ruleData[0];
      severityConfig = _determineConfigForSeverity(severity);
      if (severityConfig) {
        ruleConfig.severity = severityConfig.severity;
        ruleConfig.config = ruleData[1] !== undefined ? ruleData[1] : severityConfig.config;
      }
    }
    config.rules[key] = ruleConfig;
  }
}

function getProjectConfig(options) {
  let source = options.config || resolveProjectConfig(options);
  let config;

  if (source._processed) {
    config = source;
  } else {
    // don't mutate a `require`d object, you'll have a bad time
    config = {};

    ensureRootProperties(config, source);
    migrateRulesFromRoot(config, source, options);

    processPlugins(config, options);
    processLoadedRules(config);
    processLoadedConfigurations(config);
    processExtends(config, options);
    processIgnores(config);

    validateRules(config.rules, config.loadedRules, options);
    validateOverrides(config, options);
    processRules(config);

    config._processed = true;
  }

  return config;
}

module.exports = {
  getProjectConfig,
  getConfigForFile,
  ERROR_SEVERITY,
  WARNING_SEVERITY,
  IGNORE_SEVERITY,
};
