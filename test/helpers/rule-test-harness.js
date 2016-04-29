'use strict';

var assert = require('power-assert');
var _compile = require('htmlbars').compile;
var plugins = require('../../ext/plugins');

module.exports = function(options) {

  describe(options.name, function() {
    var DISABLE_ALL = '<!-- template-lint disable=true -->';
    var DISABLE_ONE = '<!-- template-lint ' + options.name + '=false -->';

    var messages, config;

    function compile(template) {
      _compile(template, {
        rawSource: template,
        moduleName: 'layout.hbs',
        plugins: {
          ast: [
            plugins[options.name]({
              log: function(result) {
                messages.push(result);
              },
              name: options.name,
              config: config
            })
          ]
        }
      });
    }

    beforeEach(function() {
      messages = [];
      config   = {};
      config = options.config;
    });

    options.bad.forEach(function(badItem) {

      var testMethod;
      if (!badItem.results) {
        testMethod = it.skip;
      } else if (badItem.focus) {
        testMethod = it.only;
      } else {
        testMethod = it;
      }

      var expectedMessages = badItem.messages || [badItem.message];

      testMethod('logs a message in the console when given `' + badItem.template + '`', function() {
        if (badItem.config) {
          config[options.name] = badItem.config;
        }

        compile(badItem.template);

        assert.deepEqual(messages, expectedMessages);
      });

      it('passes with `' + badItem.template + '` when rule is disabled', function() {
        config = false;
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
      var testMethod = typeof item === 'object' && item.focus ? it.only : it;

      testMethod('passes when given `' + template + '`', function() {
        if (typeof item === 'string') {
          compile(item);
        } else {
          if (item.config !== undefined) {
            config = item.config;
          }

          compile(template);
        }

        assert.deepEqual(messages, []);
      });
    });
  });
};
