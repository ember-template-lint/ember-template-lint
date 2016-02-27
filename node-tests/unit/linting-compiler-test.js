var assert = require('assert');
var buildTemplateCompiler = require('../helpers/template-compiler');
var plugins = require('../../ext/plugins');

describe('Ember template compiler', function() {
  var addonContext;
  var templateCompiler;
  var messages;
  beforeEach(function() {
    addonContext = {
      logLintingError: function(pluginName, moduleName, message) {
        messages.push(message)
      }
    }

    messages = [];

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

  it('prints to the console', function() {
    templateCompiler.registerPlugin('ast', plugins['bare-strings'](addonContext));
    templateCompiler.precompile('\n howdy', {
      moduleName: 'layout.hbs'
    });
    assert.deepEqual(messages, ["Non-translated string used (\'layout.hbs\') `\n howdy`"]);
  });
});

