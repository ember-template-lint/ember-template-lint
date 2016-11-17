'use strict';

var assert = require('power-assert');
var _precompile = require('glimmer-engine').precompile;

describe('Ember template compiler', function() {
  var astPlugins;

  function precompile(template) {
    return _precompile(template, {
      rawSource: template,
      plugins: {
        ast: astPlugins
      }
    });
  }

  beforeEach(function() {
    astPlugins = [];
  });

  it('sanity: compiles templates', function() {
    var template = precompile('<div></div>');
    assert.ok(template, 'template is created');
  });

  it('sanity: loads plugins on the template compiler', function() {
    var instanceCount = 0;
    var NoopPlugin = function(){
      instanceCount++;
    };
    NoopPlugin.prototype.transform = function(ast) {
      return ast;
    };
    astPlugins.push(NoopPlugin);
    precompile('<div></div>');

    assert.equal(instanceCount, 1, 'registered plugins are instantiated');
  });

  it('can access rawSource via options', function() {
    var options;
    var NoopPlugin = function(_options){
      options = _options;
    };
    NoopPlugin.prototype.transform = function(ast) {
      return ast;
    };
    astPlugins.push(NoopPlugin);
    var expectedTemplate = '<div></div>';
    precompile(expectedTemplate);

    assert.equal(expectedTemplate, options.rawSource, 'rawSource can be passed through compile options');
  });
});
