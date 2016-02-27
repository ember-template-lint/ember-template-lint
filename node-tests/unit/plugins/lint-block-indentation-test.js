var assert = require('assert');
var buildTemplateCompiler = require('../../helpers/template-compiler');
var plugins = require('../../../ext/plugins');

describe('Block indentation plugin', function() {

  var templateCompiler;
  beforeEach(function() {
    templateCompiler = buildTemplateCompiler();
  });

  it('fails when given incorrect indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation']);
    assert.throws(function() {

      templateCompiler.precompile('\n  {{#each cats as |dog|}} {{/each}}', {
        moduleName: 'layout.hbs'
      });
    }, /Incorrect 'each' block indention at beginning at .*layout\.hbs/m);
  });

  it('passes when given correct indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation']);
    templateCompiler.precompile('\n  {{#each cats as |dog|}}\n  {{/each}}', {
      moduleName: 'layout.hbs'
    });
  });

});
