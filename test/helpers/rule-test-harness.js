'use strict';

var assert = require('power-assert');
var assertDiff = require('assert-diff');
var Linter = require('../../lib/index');

module.exports = function(options) {

  describe(options.name, function() {
    var DISABLE_ALL = '<!-- template-lint disable=true -->';
    var DISABLE_ONE = '<!-- template-lint ' + options.name + '=false -->';

    var linter, config;

    function verify(template) {
      linter.config[options.name] = config;
      return linter.verify({ source: template, moduleId: 'layout.hbs' });
    }

    beforeEach(function() {
      var fullConfig = {};
      fullConfig[options.name] = config = options.config;

      linter = new Linter({
        config: fullConfig
      });
    });

    options.bad.forEach(function(badItem) {
      var testMethod;
      if (badItem.focus) {
        testMethod = it.only;
      } else {
        testMethod = it;
      }


      testMethod('logs a message in the console when given `' + badItem.template + '`', function() {
        var expectedResults = badItem.results || [badItem.result];

        if (badItem.config) {
          config = badItem.config;
        }

        var actual = verify(badItem.template);

        assertDiff.deepEqual(actual, expectedResults);
      });

      it('passes with `' + badItem.template + '` when rule is disabled', function() {
        config = false;
        var actual = verify(badItem.template);

        assert.deepEqual(actual, []);
      });

      it('passes with `' + badItem.template + '` when disabled via inline comment - single rule', function() {
        var actual = verify(DISABLE_ONE + '\n' + badItem.template);

        assert.deepEqual(actual, []);
      });

      it('passes with `' + badItem.template + '` when disabled via inline comment - all rules', function() {
        var actual = verify(DISABLE_ALL + '\n' + badItem.template);

        assert.deepEqual(actual, []);
      });
    });

    options.good.forEach(function(item) {
      var template = typeof item === 'object' ? item.template : item;
      var testMethod = typeof item === 'object' && item.focus ? it.only : it;

      testMethod('passes when given `' + template + '`', function() {
        var actual;
        if (typeof item === 'string') {
          actual = verify(item);
        } else {
          if (item.config !== undefined) {
            config = item.config;
          }

          actual = verify(template);
        }

        assert.deepEqual(actual, []);
      });
    });
  });
};
