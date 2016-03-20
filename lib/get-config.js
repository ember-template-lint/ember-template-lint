'use strict';

var path = require('path');
var existsSync = require('exists-sync');
var chalk = require('chalk');

function buildDefaultConfig(ui) {
  ui.log(chalk.yellow('\nember-cli-template-lint requires a configuration file to enable rules. Please generate one with `ember generate ember-cli-template-lint`.'));

  return {};
}

module.exports = function(console, templatercPath) {
  var defaultConfigPath = templatercPath || path.join(process.cwd(), '.template-lintrc');
  var overrideConfigPath = process.env['TEMPLATE_LINTRC'];
  var configPath = overrideConfigPath || defaultConfigPath;

  if(existsSync(configPath + '.js') || existsSync(configPath + '.json')) {
    return require(configPath);
  } else {
    return buildDefaultConfig(console);
  }
};
