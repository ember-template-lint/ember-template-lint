'use strict';

var assert = require('assert');
var buildTemplateCompiler = require('../helpers/template-compiler');

describe('Ember template compiler', function() {
  var templateCompiler;

  beforeEach(function() {
    templateCompiler = buildTemplateCompiler();
  });

  it('sanity: compiles templates', function() {
    var template = templateCompiler.precompile('<div></div>');
    assert.ok(template, 'template is created from precompile');
  });

  it('sanity: loads plugins on the template compiler', function() {
    var instanceCount = 0;
    var NoopPlugin = function(){
      instanceCount++;
    };
    NoopPlugin.prototype.transform = function(ast) {
      return ast;
    };
    templateCompiler.registerPlugin('ast', NoopPlugin);
    templateCompiler.precompile('<div></div>');
    assert.equal(instanceCount, 1, 'registered plugins are instantiated');
  });
});
