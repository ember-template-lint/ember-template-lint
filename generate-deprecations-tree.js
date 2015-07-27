'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var quickTemp = require('quick-temp');
var hashStrings = require('broccoli-kitchen-sink-helpers').hashStrings;

function TemplateLinter(deprecationSource) {
  this.description = 'TemplateLinter';
  this.deprecationSource = deprecationSource;
  this.lastHash = undefined;
}

TemplateLinter.prototype.content = function() {
  return this.deprecationSource._deprecations
    .map(function(item) {
      return 'Ember.deprecate(\n' +
        '  ' + item.message + ',\n' +
        '  ' + item.test + ',\n' +
        '  ' + item.options + '\n' +
        ');';
    })
    .join('\n');
};

TemplateLinter.prototype.read = function() {
  var dir = quickTemp.makeOrReuse(this, 'template-linter-cache');

  var outputPath = path.join(dir, 'template-deprecations-test.js');

  var content = this.content();
  var hash = hashStrings([content]);

  if (this.lastHash !== hash) {
    this.lastHash = hash;
    fs.writeFileSync(outputPath, content);
  }

  return dir;
};

TemplateLinter.prototype.cleanup = function() {
  return rimraf.sync(this['template-linter-cache']);
};


module.exports = TemplateLinter;
