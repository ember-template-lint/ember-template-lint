import chalk from 'chalk';
import { findUpSync } from 'find-up';
import micromatch from 'micromatch';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import resolve from 'resolve';

import defaultConfigurations from './config/index.js';
import DEPRECATED_RULES from './helpers/deprecated-rules.js';
import determineRuleConfig from './helpers/determine-rule-config.js';
import defaultRules from './rules/index.js';

const require = createRequire(import.meta.url);

const KNOWN_ROOT_PROPERTIES = new Set([
  'extends',
  'rules',
  'ignore',
  'plugins',
  'overrides',
  'format',
]);
const SUPPORTED_OVERRIDE_KEYS = new Set(['files', 'rules']);
const SUPPORTED_FORMAT_PROPS = new Set(['name', 'outputFile']);

const CONFIG_FILE_NAMES = ['.template-lintrc.js', '.template-lintrc.mjs', '.template-lintrc.cjs'];
const ALLOWED_ERROR_CODES = new Set([
  // resolve package error codes
  'MODULE_NOT_FOUND',

  // Yarn PnP Error Code
  'QUALIFIED_PATH_RESOLUTION_FAILED',
]);

async function requirePlugin(workingDir, pluginName, fromConfigPath) {
  let basedir = fromConfigPath === undefined ? workingDir : path.dirname(fromConfigPath);

  // throws exception if not found
  let pluginPath = resolve.sync(pluginName, { basedir, extensions: ['.js', '.mjs', '.cjs'] });

  try {
    let pluginURL = pathToFileURL(pluginPath);

    const { default: plugin } = await import(pluginURL);
    return plugin;
  } catch (error) {
    // Fallback to ensure we can load CJS plugins in Node versions before 16 (TODO: remove eventually).
    return requireFallback(pluginPath, error);
  }
}

export async function resolveProjectConfig(workingDir, options) {
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
    configPath = findUpSync(CONFIG_FILE_NAMES, {
      cwd: workingDir,
    });

    if (configPath === undefined) {
      // we weren't given an explicit --config-path argument, and we couldn't
      // find a relative .template-lintrc.js file, just use the default "empty" config
      return {};
    }
  }

  options.resolvedConfigPath = configPath;

  try {
    const { default: config } = await import(pathToFileURL(configPath));
    return config;
  } catch (error) {
    // Fallback to ensure we can load CJS configs in Node versions before 16 (TODO: remove eventually).
    return requireFallback(configPath, error);
  }
}

/**
 * Attempts to require a module using `require()` this is used as a fallback
 * for when `import()` fails to load a module. This is needed to support loading
 * CJS modules in legacy Node versions. If the module is ESM, then a ERR_REQUIRE_ESM
 * error will be throw by `require`, in that case the original import error must be thrown.
 *
 * @todo remove this fallback once we drop support for Node 14
 * @param {string} requirePath path of module to require
 * @param {Error} importError error thrown by import()
 * @throws {Error} error thrown by require() or importError if the module is ESM
 */
function requireFallback(requirePath, importError) {
  try {
    return require(requirePath); // eslint-disable-line import/no-dynamic-require
  } catch (error) {
    if (importError && error.code === 'ERR_REQUIRE_ESM') {
      // if the module is ESM, throw the original import error
      throw importError;
    }

    throw error;
  }
}

async function forEachPluginConfiguration(plugins, callback) {
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

      await callback(configuration, configurationName, pluginName);
    }
  }
}

function normalizeExtends(config) {
  let extendedList = [];
  if (config.extends) {
    if (typeof config.extends === 'string') {
      extendedList = [config.extends];
    } else if (Array.isArray(config.extends)) {
      extendedList = [...config.extends];
    } else {
      throw new TypeError('config.extends should be string or array');
    }
  }
  return extendedList;
}

function ensureRootProperties(config, source) {
  config.rules = Object.assign({}, source.rules || {});
  config.overrides = [...(source.overrides || [])];
  config.ignore = [...(source.ignore || [])];
  config.extends = source.extends;
  config.format = Object.assign({}, source.format || {});
}

function validateRootProperties(source) {
  for (let key in source) {
    if (!KNOWN_ROOT_PROPERTIES.has(key)) {
      throw new Error(`Unknown top-level configuration property detected: ${key}`);
    }
  }
}

async function processPlugins(workingDir, plugins = [], options, checkForCircularReference) {
  let pluginsHash = {};

  for (let plugin of plugins) {
    let pluginName;

    if (typeof plugin === 'string') {
      pluginName = plugin;
      // the second argument here should actually be the config file path for
      // the _currently being processed_ config file (not neccesarily the one
      // specified to the bin script)
      plugin = await requirePlugin(workingDir, pluginName, options.resolvedConfigPath);
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
      throw new Error(errorMessage);
    }
  }

  await forEachPluginConfiguration(pluginsHash, async (configuration) => {
    // process plugins recursively
    Object.assign(
      pluginsHash,
      await processPlugins(workingDir, configuration.plugins, options, pluginsHash)
    );
  });

  return pluginsHash;
}

async function processLoadedRules(workingDir, config, options) {
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

  await forEachPluginConfiguration(config.plugins, async (configuration) => {
    let plugins = await processPlugins(workingDir, configuration.plugins, options, config.plugins);
    // process plugins recursively
    await processLoadedRules(workingDir, { plugins, loadedRules });
  });

  return loadedRules;
}

async function processLoadedConfigurations(workingDir, config, options) {
  let loadedConfigurations;
  if (config.loadedConfigurations) {
    loadedConfigurations = config.loadedConfigurations;
  } else {
    // load all the default configurations in `ember-template-lint`
    loadedConfigurations = Object.assign({}, defaultConfigurations);
  }

  await forEachPluginConfiguration(
    config.plugins,
    async (configuration, configurationName, pluginName) => {
      let name = `${pluginName}:${configurationName}`;
      loadedConfigurations[name] = configuration;

      // load plugins recursively
      const plugins = await processPlugins(
        workingDir,
        configuration.plugins,
        options,
        config.plugins
      );
      await processLoadedConfigurations(workingDir, { plugins, loadedConfigurations }, options);
    }
  );

  return loadedConfigurations;
}

function processExtends(config) {
  let extendedList = normalizeExtends(config);
  let extendedRules = {};
  let extendedOverrides = [];

  if (extendedList) {
    for (const extendName of extendedList) {
      let configuration = config.loadedConfigurations[extendName];
      if (configuration) {
        // ignore loops
        if (!configuration.loadedConfigurations) {
          configuration.loadedConfigurations = config.loadedConfigurations;

          // continue chaining `extends` from plugins until done
          processExtends(configuration);

          delete configuration.loadedConfigurations;

          if (configuration.overrides) {
            extendedOverrides = [...extendedOverrides, ...configuration.overrides];
          }

          if (configuration.rules) {
            extendedRules = Object.assign({}, extendedRules, configuration.rules);
          } else {
            throw new Error(`Missing rules for extends: ${extendName}`);
          }
        }
      } else {
        throw new Error(`Cannot find configuration for extends: ${extendName}`);
      }

      delete config.extends;
    }

    config.rules = Object.assign({}, extendedRules, config.rules);
    config.overrides = [...extendedOverrides, ...(config.overrides || [])];
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
export function getRuleFromString(rule) {
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

function validateFormat(config) {
  if ('formatters' in config.format) {
    for (let format of config.format.formatters) {
      for (let formatProp of Object.keys(format)) {
        if (!SUPPORTED_FORMAT_PROPS.has(formatProp)) {
          throw new Error(
            `An invalid \`format.formatter\` in \`.template-lintrc.js\` was provided. Unexpected property \`${formatProp}\``
          );
        }
      }
    }
  }
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
export function processRules(config) {
  let processedRules = Object.assign({}, config.rules);

  for (let key in processedRules) {
    let ruleData = processedRules[key];
    processedRules[key] = determineRuleConfig(ruleData);
  }
  return processedRules;
}

export async function getProjectConfig(workingDir, options) {
  let source = options.config || (await resolveProjectConfig(workingDir, options));
  let config;

  if (source._processed) {
    config = source;
  } else {
    // don't mutate a `require`d object, you'll have a bad time
    config = {};

    ensureRootProperties(config, source);
    validateRootProperties(source);

    config.plugins = await processPlugins(workingDir, source.plugins, options);
    config.loadedRules = await processLoadedRules(workingDir, config, options);
    config.loadedConfigurations = await processLoadedConfigurations(workingDir, config, options);
    processExtends(config);
    processIgnores(config);

    validateRules(config.rules, config.loadedRules, options);
    validateOverrides(config, options);
    validateFormat(config);
    config.rules = processRules(config);

    config._processed = true;
  }

  return config;
}
