// copied from emberjs/ember.js packages/ember-template-compiler/lib/system/calculate-location-display.js
module.exports = function calculateLocationDisplay(moduleName, _loc) {
  var loc = _loc || {};
  var start = loc.start || {};
  var column = start.column;
  var line = start.line;
  var moduleInfo = '';
  if (moduleName) {
    moduleInfo +=  "'"+moduleName+"'";
  }

  if (line !== undefined && column !== undefined) {
    if (moduleName) {
      // only prepend @ if the moduleName was present
      moduleInfo += '@ ';
    }
    moduleInfo += `L${line}:C${column}`;
  }

  if (moduleInfo) {
    moduleInfo = `(${moduleInfo})`;
  }

  return moduleInfo;
}
