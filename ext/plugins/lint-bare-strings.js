// copied from emberjs/ember.js packages/ember-template-compiler/lib/system/calculate-location-display.js
function calculateLocationDisplay(moduleName, _loc) {
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

function LogStaticStrings(options) {
  this.options = options;
  this.syntax = null; // set by HTMLBars
}

LogStaticStrings.prototype.transform = function(ast) {
  var pluginContext = this;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function(node) {
    if (pluginContext.detectStaticString(node)) {
      return pluginContext.processStaticString(node);
    }
  });

  return ast;
};

LogStaticStrings.prototype.processStaticString = function(node) { 
  var locationDisplay = calculateLocationDisplay(this.options.moduleName, node.loc);

  throw new Error(`Non-translated string used ${locationDisplay} \`${node.chars}\``);
}

LogStaticStrings.prototype.detectStaticString = function(node) {  
  return node.type === 'TextNode' && !node.raw && node.chars.trim() !== '';
};

module.exports = LogStaticStrings;
