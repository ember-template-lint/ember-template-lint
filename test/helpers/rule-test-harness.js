'use strict';

const expect = require('chai').expect;
const Linter = require('../../lib/index');
const assign = require('lodash').assign;

module.exports = function(options) {
  let groupingMethod = options.focus ? describe.only : describe;
  groupingMethod(options.name, function() {
    let DISABLE_ALL = '{{! template-lint-disable }}';
    let DISABLE_ONE = `{{! template-lint-disable ${options.name} }}`;

    let linter, config;

    function verify(template) {
      linter.config.rules[options.name] = config;
      return linter.verify({ source: template, moduleId: 'layout.hbs' });
    }

    beforeEach(function() {
      let fullConfig = {
        rules: { }
      };
      fullConfig.rules[options.name] = config = options.config;

      linter = new Linter({
        config: fullConfig
      });
    });

    options.bad.forEach(function(badItem) {
      let testMethod;
      if (badItem.focus) {
        testMethod = it.only;
      } else {
        testMethod = it;
      }

      function parseResult(result) {
        let defaults = {
          rule: options.name,
          moduleId: 'layout.hbs',
          severity: 2
        };

        return assign({}, defaults, result);
      }

      testMethod(`logs a message in the console when given \`${badItem.template}\``, function() {
        let expectedResults = badItem.results || [badItem.result];

        expectedResults = expectedResults.map(parseResult);

        if (badItem.config) {
          config = badItem.config;
        }

        let actual = verify(badItem.template);

        expect(actual).to.deep.equal(expectedResults);
      });

      it(`passes with \`${badItem.template}\` when rule is disabled`, function() {
        config = false;
        let actual = verify(badItem.template);

        expect(actual).to.deep.equal([]);
      });

      it(`passes with \`${badItem.template}\` when disabled via inline comment - single rule`, function() {
        let actual = verify(DISABLE_ONE + '\n' + badItem.template);

        expect(actual).to.deep.equal([]);
      });

      it(`passes with \`${badItem.template}\` when disabled via inline comment - all rules`, function() {
        let actual = verify(DISABLE_ALL + '\n' + badItem.template);

        expect(actual).to.deep.equal([]);
      });
    });

    options.good.forEach(function(item) {
      let template = typeof item === 'object' ? item.template : item;
      let testMethod = typeof item === 'object' && item.focus ? it.only : it;

      testMethod(`passes when given \`${template}\``, function() {
        let actual;
        if (typeof item === 'string') {
          actual = verify(item);
        } else {
          if (item.config !== undefined) {
            config = item.config;
          }

          actual = verify(template);
        }

        expect(actual).to.deep.equal([]);
      });
    });
  });
};
