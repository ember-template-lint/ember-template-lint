/* jshint node: true */
'use strict';

var existsSync = require('exists-sync');
var chalk = require('chalk');

module.exports = {
  name: 'ember-cli-template-lint',

  loadConfig: function() {
    var defaultConfig  = this.project.root + '/.template-lintrc';
    var overrideConfig = process.env['TEMPLATE_LINTRC'];
    var config = overrideConfig || defaultConfig;
    if(existsSync(config)) {
      return require(config);
    } else {
      return {};
    }
  },

  logLintingError: function(pluginName, moduleName, message) {
    this.ui.writeLine(chalk.yellow(message));
  }
};
