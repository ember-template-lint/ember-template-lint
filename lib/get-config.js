'use strict';

var path = require('path');
var assign = require('lodash').assign;
var existsSync = require('exists-sync');
var chalk = require('chalk');
var rules = require('./rules');

var KNOWN_ROOT_PROPERTIES = ['extends', 'rules', 'pending'];

function readConfigFromDisk(options) {
  var providedConfigPath = options.configPath;
  var configPath = providedConfigPath || path.join(process.cwd(), '.template-lintrc');

  if(existsSync(configPath) || existsSync(configPath + '.js') || existsSync(configPath + '.json')) {
    return require(configPath);
  } else {
    return {};
  }
}

function ensureRootProperties(config) {
  config.rules = config.rules || {};
  config.pending = config.pending || [];
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

function processExtends(config) {
  if (config.extends) {
    var extendingConfig = require('./config/' + config.extends);

    config = assign({}, extendingConfig, config);
    config.rules = assign({}, extendingConfig.rules, config.rules);

    delete config.extends;
  }

  return config;
}

function validateRules(config, options) {
  var logger = options.console || console;
  var invalidKeysFound = [];

  for (var key in config.rules) {
    if (!rules[key]) {
      invalidKeysFound.push(key);
    }
  }

  if (invalidKeysFound.length > 0) {
    logger.log(chalk.yellow('Invalid rule configuration found: ' + invalidKeysFound));
  }
}

module.exports = function(options) {
  var config = options.config || readConfigFromDisk(options);

  ensureRootProperties(config);
  migrateRulesFromRoot(config, options);

  config = processExtends(config);

  validateRules(config, options);

  return config;
};
