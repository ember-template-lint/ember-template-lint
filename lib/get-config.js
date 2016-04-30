'use strict';

var path = require('path');
var existsSync = require('exists-sync');

function readConfigFromDisk(options) {
  var providedConfigPath = options.configPath;
  var configPath = providedConfigPath || path.join(process.cwd(), '.template-lintrc');

  if(existsSync(configPath) || existsSync(configPath + '.js') || existsSync(configPath + '.json')) {
    return require(configPath);
  } else {
    return {};
  }
}

module.exports = function(options) {
  var config = options.config || readConfigFromDisk(options);

  return config;
};
