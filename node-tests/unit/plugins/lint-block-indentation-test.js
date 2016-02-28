var assert = require('assert');
var buildTemplateCompiler = require('../../helpers/template-compiler');
var plugins = require('../../../ext/plugins');

describe('Block indentation plugin', function() {
  var addonContext;
  var templateCompiler;
  var messages;
  var config;

  beforeEach(function() {
    messages = [];
    config   = {};

    addonContext = {
      logLintingError: function(pluginName, moduleName, message) {
        messages.push(message)
      },
      loadConfig: function() {
        return config;
      }
    }


    templateCompiler = buildTemplateCompiler();
  });

  it('logs a message in the console when given incorrect indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation'](addonContext));
    templateCompiler.precompile('\n  {{#each cats as |dog|}}  {{/each}}', {
      moduleName: 'layout.hbs'
    });

    assert.deepEqual(messages, ["Incorrect `each` block indention at beginning at ('layout.hbs'@ L2:C2)"]);
  });

  it('passes when given correct indentation', function() {
    templateCompiler.registerPlugin('ast', plugins['block-indentation'](addonContext));
    templateCompiler.precompile('\n  {{#each cats as |dog|}}\n  {{/each}}', {
      moduleName: 'layout.hbs'
    });

    assert.deepEqual(messages, []);
  });

  it('passes when given correct indentation', function() {
    config['block-indentation'] = false;
    templateCompiler.registerPlugin('ast', plugins['block-indentation'](addonContext));
    templateCompiler.precompile('\n  {{#each cats as |dog|}}\n    {{/each}}', {
      moduleName: 'layout.hbs'
    });

    assert.deepEqual(messages, []);
  });
});
