'use strict';

var assert = require('assert');
var _compile = require('htmlbars').compile;
var plugins = require('../../ext/plugins');

module.exports = function(options) {

  describe(options.name, function() {
    var DISABLE_ALL = '<!-- template-lint disable=true -->';
    var DISABLE_ONE = '<!-- template-lint ' + options.name + '=false -->';

    var addonContext,  messages, config;

    function compile(template) {
      _compile(template, {
        moduleName: 'layout.hbs',
        plugins: {
          ast: [
            plugins[options.name](addonContext)
          ]
        }
      });
    }

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
    });

    options.bad.forEach(function(badItem) {
      it('logs a message in the console when given `' + badItem.template + '`', function() {
        compile(badItem.template);

        assert.deepEqual(messages, [badItem.message]);
      });

      it('passes with `' + badItem.template + '` when rule is disabled', function() {
        config[options.name] = false;
        compile(badItem.template);

        assert.deepEqual(messages, []);
      });

      it('passes with `' + badItem.template + '` when disabled via inline comment - single rule', function() {
        compile(DISABLE_ONE + '\n' + badItem.template);

        assert.deepEqual(messages, []);
      });

      it('passes with `' + badItem.template + '` when disabled via inline comment - all rules', function() {
        compile(DISABLE_ALL + '\n' + badItem.template);

        assert.deepEqual(messages, []);
      });
    });

    options.good.forEach(function(goodItem) {
      it('passes when given `' + goodItem + '`', function() {
        compile(goodItem);

        assert.deepEqual(messages, []);
      });
    });
  });
};
