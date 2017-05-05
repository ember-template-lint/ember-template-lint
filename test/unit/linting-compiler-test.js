'use strict';

var expect = require('chai').expect;
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
    expect(template).to.be.ok;
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

    expect(instanceCount).to.equal(1);
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

    expect(options.rawSource).to.equal(expectedTemplate);
  });
});
