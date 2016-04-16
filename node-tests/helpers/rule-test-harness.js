'use strict';

var assert = require('assert');
var _compile = require('htmlbars').compile;
var plugins = require('../../ext/plugins');

module.exports = function(options) {

  describe(options.name, function() {
    var DISABLE_ALL = '<!-- template-lint disable=true -->';
    var DISABLE_ONE = '<!-- template-lint ' + options.name + '=false -->';

    var addonContext, messages, config;

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
      config[options.name] = options.config;

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
      var testMethod = badItem.focus ? it.only : it;
      var expectedMessages = badItem.messages || [badItem.message];

      testMethod('logs a message in the console when given `' + badItem.template + '`', function() {
        if (badItem.config) {
          config[options.name] = badItem.config;
        }

        compile(badItem.template);

        assert.deepEqual(messages, expectedMessages);
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

    options.good.forEach(function(item) {
      var template = typeof item === 'object' ? item.template : item;

      it('passes when given `' + template + '`', function() {
        if (typeof item === 'string') {
          compile(item);
        } else {
          if (item.config) {
            config[options.name] = item.config;
          }

          compile(template);
        }

        assert.deepEqual(messages, []);
      });
    });
  });
};
