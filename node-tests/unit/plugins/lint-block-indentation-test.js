var assert = require('assert');
var buildTemplateCompiler = require('../../helpers/template-compiler');
var plugins = require('../../../ext/plugins');

describe('Block indentation plugin', function() {
  var addonContext;
  var templateCompiler;
  var messages;

  beforeEach(function() {
    addonContext = {
      ui: {
        writeWarnLine: function(message) {
          messages.push(message)
        }
      }
    }

    messages = [];

    templateCompiler = buildTemplateCompiler();
  });

  it('fails when given incorrect indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation'](addonContext));
    assert.throws(function() {

      templateCompiler.precompile('\n  {{#each cats as |dog|}} {{/each}}', {
        moduleName: 'layout.hbs'
      });
    }, /Incorrect 'each' block indention at beginning at .*layout\.hbs/m);
  });

  it('logs a message in the console when given incorrect indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation'](addonContext));
    try {
      templateCompiler.precompile('\n  {{#each cats as |dog|}}  {{/each}}', {
        moduleName: 'layout.hbs'
      });
    } catch (e) {}

    assert.deepEqual(messages, ["Incorrect 'each' block indention at beginning at ('layout.hbs'@ L2:C2)"]);
  });

  it('passes when given correct indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation'](addonContext));
    templateCompiler.precompile('\n  {{#each cats as |dog|}}\n  {{/each}}', {
      moduleName: 'layout.hbs'
    });
  });
});
