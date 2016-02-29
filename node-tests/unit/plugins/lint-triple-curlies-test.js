'use strict';

var assert = require('assert');
var buildTemplateCompiler = require('../../helpers/template-compiler');
var plugins = require('../../../ext/plugins');

describe('triple curlies', function() {
  var GOOD = '{{foo}}';
  var BAD = '\n {{{foo}}}';
  var addonContext;
  var templateCompiler;
  var messages;
  var config;

  beforeEach(function() {
    messages = [];
    config   = {};

    addonContext = {
      logLintingError: function(pluginName, moduleName, message) {
        messages.push(message);
      },
      loadConfig: function() {
        return config;
      }
    };


    templateCompiler = buildTemplateCompiler();
  });

  it('logs a message in the console when given triple curlies', function() {
    templateCompiler.registerPlugin('ast', plugins['triple-curlies'](addonContext));
    templateCompiler.precompile(BAD, {
      moduleName: 'layout.hbs'
    });

    assert.deepEqual(messages, ['Usage of triple curly brackets is unsafe `{{{foo}}}` at (\'layout.hbs\'@ L2:C1)']);
  });

  it('passes when given {{foo}}', function() {
    templateCompiler.registerPlugin('ast', plugins['triple-curlies'](addonContext));
    templateCompiler.precompile(GOOD, {
      moduleName: 'layout.hbs'
    });

    assert.deepEqual(messages, []);
  });

  it('passes with `{{{foo}}}` when rule is disabled', function() {
    config['triple-curlies'] = false;
    templateCompiler.registerPlugin('ast', plugins['triple-curlies'](addonContext));
    templateCompiler.precompile(BAD, {
      moduleName: 'layout.hbs'
    });

    assert.deepEqual(messages, []);
  });
});
