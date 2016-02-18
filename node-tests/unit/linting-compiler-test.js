var assert = require('assert');
var buildTemplateCompiler = require('../helpers/template-compiler');
var plugins = require('../../ext/plugins');

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
    var template = templateCompiler.precompile('<div></div>');
    assert.equal(instanceCount, 1, 'registered plugins are instantiated');
  });

  it('can run a single template + rule', function() {
    templateCompiler.registerPlugin('ast', plugins['bare-strings']);
    assert.throws(function() {
      templateCompiler.precompile('\n howdy', {
        moduleName: 'layout.hbs'
      });
    }, /Non-translated string used.*layout\.hbs/m);
  });

});
