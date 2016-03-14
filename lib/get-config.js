'use strict';

var path = require('path');
var existsSync = require('exists-sync');
var chalk = require('chalk');

function buildDefaultConfig(ui) {
  ui.log(chalk.yellow('\nFuture versions of ember-cli-template-lint will require a `.template-lintrc.js` file in your project, \n' +
                      'and will not automatically enable all rules. Please run `ember generate ember-cli-template-lint` to create the default \n' +
                      'configuration.'));

  return {
    'bare-strings': true,
    'block-indentation': 2,
    'triple-curlies': true
  };
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
