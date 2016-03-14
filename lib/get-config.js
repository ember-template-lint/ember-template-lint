var path = require('path');
var existsSync = require('exists-sync');

function buildDefaultConfig() {
  return {};
}

module.exports = function(templatercPath) {
  var defaultConfigPath = templatercPath || path.join(process.cwd(), '.template-lintrc');
  var overrideConfigPath = process.env['TEMPLATE_LINTRC'];
  var configPath = overrideConfigPath || defaultConfigPath;

  if(existsSync(configPath + '.js') || existsSync(configPath + '.json')) {
    return require(configPath);
  } else {
    return buildDefaultConfig();
  }
};
