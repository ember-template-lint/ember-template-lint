'use strict';

const expect = require('chai').expect;
const _precompile = require('@glimmer/compiler').precompile;

describe('Ember template compiler', function() {
  let astPlugins;

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
    let template = precompile('<div></div>');
    expect(template).to.be.ok;
  });

  it('sanity: loads plugins on the template compiler', function() {
    let instanceCount = 0;
    let NoopPlugin = function(){
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
    let options;
    let NoopPlugin = function(_options){
      options = _options;
    };
    NoopPlugin.prototype.transform = function(ast) {
      return ast;
    };
    astPlugins.push(NoopPlugin);
    let expectedTemplate = '<div></div>';
    precompile(expectedTemplate);

    expect(options.rawSource).to.equal(expectedTemplate);
  });
});
