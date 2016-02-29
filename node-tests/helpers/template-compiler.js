'use strict';

var path = require('path');
var templateCompilerPath = path.join(__dirname, '../../bower_components/ember/ember-template-compiler.js');

module.exports = function() {
  var compiler = require(templateCompilerPath);
  // ensure we get a fresh templateCompilerModuleInstance per ember-addon
  // instance NOTE: this is a quick hack, and will only work as long as
  // templateCompilerPath is a single file bundle
  //
  // (╯°□°）╯︵ ɹǝqɯǝ
  //
  // we will also fix this in ember for future releases
  delete require.cache[templateCompilerPath];
  delete global.Ember;
  delete global.EmberENV;

  return compiler;
};
