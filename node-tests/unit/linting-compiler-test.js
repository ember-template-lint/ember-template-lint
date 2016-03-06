'use strict';

var assert = require('assert');
var _compile = require('htmlbars').compile;

describe('Ember template compiler', function() {
  var astPlugins;

  function compile(template) {
    return _compile(template, {
      plugins: {
        ast: astPlugins
      }
    });
  }

  beforeEach(function() {
    astPlugins = [];
  });

  it('sanity: compiles templates', function() {
    var template = compile('<div></div>');
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
    compile('<div></div>');

    assert.equal(instanceCount, 1, 'registered plugins are instantiated');
  });
});
