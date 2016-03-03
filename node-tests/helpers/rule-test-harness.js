'use strict';

var assert = require('assert');
var buildTemplateCompiler = require('./template-compiler');
var plugins = require('../../ext/plugins');

module.exports = function(options) {

  describe(options.name, function() {
    var DISABLE_ALL = '<!-- template-lint disable=true -->';
    var DISABLE_ONE = '<!-- template-lint ' + options.name + '=false -->';

    var addonContext, templateCompiler,  messages, config;

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

    options.bad.forEach(function(badItem) {
      it('logs a message in the console when given `' + badItem.template + '`', function() {
        templateCompiler.registerPlugin('ast', plugins[options.name](addonContext));
        templateCompiler.precompile(badItem.template, {
          moduleName: 'layout.hbs'
        });

        assert.deepEqual(messages, [badItem.message]);
      });

      it('passes with `' + badItem.template + '` when rule is disabled', function() {
        config[options.name] = false;
        templateCompiler.registerPlugin('ast', plugins[options.name](addonContext));
        templateCompiler.precompile(badItem.template, {
          moduleName: 'layout.hbs'
        });

        assert.deepEqual(messages, []);
      });

      it('passes with `' + badItem.template + '` when disabled via inline comment - single rule', function() {
        templateCompiler.registerPlugin('ast', plugins[options.name](addonContext));
        templateCompiler.precompile(DISABLE_ONE + '\n' + badItem.template, {
          moduleName: 'layout.hbs'
        });

        assert.deepEqual(messages, []);
      });

      it('passes with `' + badItem.template + '` when disabled via inline comment - all rules', function() {
        templateCompiler.registerPlugin('ast', plugins[options.name](addonContext));
        templateCompiler.precompile(DISABLE_ALL + '\n' + badItem.template, {
          moduleName: 'layout.hbs'
        });

        assert.deepEqual(messages, []);
      });
    });

    options.good.forEach(function(goodItem) {
      it('passes when given `' + goodItem + '`', function() {
        templateCompiler.registerPlugin('ast', plugins[options.name](addonContext));
        templateCompiler.precompile(goodItem, {
          moduleName: 'layout.hbs'
        });

        assert.deepEqual(messages, []);
      });
    });
  });
};
