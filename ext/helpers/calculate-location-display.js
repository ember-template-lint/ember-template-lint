'use strict';

// copied from emberjs/ember.js packages/ember-template-compiler/lib/system/calculate-location-display.js
module.exports = function calculateLocationDisplay(moduleName, _locPortion) {
  var locPortion = _locPortion || {};
  var column = locPortion.column;
  var line = locPortion.line;
  var moduleInfo = '';
  if (moduleName) {
    moduleInfo +=  '\'' + moduleName + '\'';
  }

  if (line !== undefined && column !== undefined) {
    if (moduleName) {
      // only prepend @ if the moduleName was present
      moduleInfo += '@ ';
    }
    moduleInfo += 'L' + line + ':C' + column;
  }

  if (moduleInfo) {
    moduleInfo = '(' + moduleInfo + ')';
  }

  return moduleInfo;
};
