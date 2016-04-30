'use strict';

/*eslint no-console: [0] */

var path = require('path');
var existsSync = require('exists-sync');

module.exports = function(console, templatercPath) {
  var defaultConfigPath = templatercPath || path.join(process.cwd(), '.template-lintrc');
  var overrideConfigPath = process.env['TEMPLATE_LINTRC'];
  var configPath = overrideConfigPath || defaultConfigPath;

  if(existsSync(configPath) || existsSync(configPath + '.js') || existsSync(configPath + '.json')) {
    return require(configPath);
  } else {
    return {};
  }
};
