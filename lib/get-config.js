'use strict';

var path = require('path');
var resolve = require('resolve');
var assign = require('lodash').assign;
var chalk = require('chalk');
var defaultRules = require('./rules');
var defaultConfigurations = require('./config/index');

var KNOWN_ROOT_PROPERTIES = ['extends', 'rules', 'pending', 'ignore', 'plugins'];


function resolveConfigPath(configPath, pluginPath) {

  configPath = configPath || path.join(process.cwd(), '.template-lintrc');


  if (pluginPath) {

    //throws exception if not found
    pluginPath = resolve.sync(pluginPath, { basedir: path.dirname(configPath) });

  }

  try {
    var filePath = pluginPath || configPath;
    return require(filePath);
  } catch(e) {
    return {};
  }

}

function ensureRootProperties(config) {
  config.rules = config.rules || {};
  config.pending = config.pending || [];
  config.ignore = config.ignore || [];
  config.plugins = config.plugins || [];
}

function migrateRulesFromRoot(config, options) {
  var logger = options.console || console;

  var invalidKeysFound = [];
  for (var key in config) {
    if (KNOWN_ROOT_PROPERTIES.indexOf(key) === -1) {
      invalidKeysFound.push(key);

      config.rules[key] = config[key];
      delete config[key];
    }
  }

  if (invalidKeysFound.length > 0) {
    logger.log(chalk.yellow(
      [
        'Rule configuration has been moved into a `rules` property.',
        'Please update your `.template-lintrc.js` file.',
        'The following rules have been migrated to the `rules`',
        'property: ' + invalidKeysFound + '.'
      ].join(' ')
    ));
  }
}

function processPlugins(config, options) {

  var logger = options.console || console;

  var configPlugins = config.plugins;
  var pluginsHash = {};

  for (var i = 0; i < configPlugins.length; i++) {

    var plugin = configPlugins[i];
    var pluginName;

    if (typeof plugin === 'string') {
      pluginName = plugin;
      plugin = resolveConfigPath(options.configPath, pluginName);
    }


    var errorMessage;
    if (typeof plugin === 'object') {

      if (plugin.name) {
        pluginsHash[plugin.name] = plugin;
      } else if (pluginName) {
        errorMessage = 'Plugin (' + pluginName + ') has not defined the plugin `name` property';
      } else {
        errorMessage = 'Inline plugin object has not defined the plugin `name` property';
      }

    } else if (pluginName) {
      errorMessage = 'Plugin (' + pluginName + ') did not return a plain object';
    } else {
      errorMessage = 'Inline plugin is not a plain object';
    }

    if (errorMessage) {
      logger.log(chalk.yellow(errorMessage));
    }

  }

  config.plugins = pluginsHash;
}

function processLoadedRules(config) {

  //load all the default rules in `ember-template-lint`
  var loadedRules = assign({}, defaultRules);

  //load plugin rules
  for (var name in config.plugins) {

    var pluginRules = config.plugins[name].rules;
    if (pluginRules) {
      loadedRules = assign(loadedRules, pluginRules);
    }

  }

  config.loadedRules = loadedRules;

}

function processLoadedConfigurations(config) {

  //load all the default configurations in `ember-template-lint`
  var loadedConfigurations = assign({}, defaultConfigurations);

  //load plugin configurations
  for (var pluginName in config.plugins) {

    var pluginConfigurations = config.plugins[pluginName].configurations;
    if (pluginConfigurations) {

      for (var configurationName in pluginConfigurations) {


        var name = pluginName + ':' + configurationName;
        loadedConfigurations[name] = pluginConfigurations[configurationName];

      }
    }

  }

  config.loadedConfigurations = loadedConfigurations;

}

function processExtends(config, options) {

  var logger = options.console || console;

  if (config.extends) {

    var extendedList = [];
    if (typeof config.extends === 'string') {
      extendedList = [config.extends];
    } else if (config.extends instanceof Array) {
      extendedList = config.extends;
    } else {
      logger.log(chalk.yellow('config.extends should be string or array '));
    }

    for (var i = 0; i < extendedList.length; i++) {

      var extendName = extendedList[i];

      var configuration = config.loadedConfigurations[extendName];
      if (configuration) {

        if (configuration.rules) {

          config.rules = assign(config.rules, configuration.rules);

        } else {

          logger.log(chalk.yellow('Missing rules for extends: ' + extendName));

        }

      } else {

        logger.log(chalk.yellow('Cannot find configuration for extends: ' + extendName));

      }


    }

    delete config.extends;
  }

}

function validateRules(config, options) {
  var logger = options.console || console;
  var invalidKeysFound = [];

  for (var key in config.rules) {
    if (!config.loadedRules[key]) {
      invalidKeysFound.push(key);
    }
  }

  if (invalidKeysFound.length > 0) {
    logger.log(chalk.yellow('Invalid rule configuration found: ' + invalidKeysFound));
  }
}

module.exports = function(options) {
  var config = options.config || resolveConfigPath(options.configPath);

  if (!config._processed) {
    ensureRootProperties(config);
    migrateRulesFromRoot(config, options);

    processPlugins(config, options);
    processLoadedRules(config);
    processLoadedConfigurations(config);
    processExtends(config, options);

    validateRules(config, options);

    config._processed = true;
  }

  return config;
};
