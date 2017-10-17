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
      let template = badItem.template;
      let testMethod = badItem.focus ? it.only : it;

      function parseResult(result) {
        let defaults = {
          rule: options.name,
          severity: 2
        };

        if (result.moduleId !== null) {
          defaults.moduleId = 'layout.hbs';
        } else {
          delete result.moduleId;
        }

        return assign({}, defaults, result);
      }

      testMethod(`logs a message in the console when given \`${template}\``, function() {
        let expectedResults = badItem.results || [badItem.result];

        expectedResults = expectedResults.map(parseResult);

        if (badItem.config) {
          config = badItem.config;
        }

        let actual = verify(template);

        expect(actual).to.deep.equal(expectedResults);
      });

      testMethod(`passes with \`${template}\` when rule is disabled`, function() {
        config = false;
        let actual = verify(template);

        expect(actual).to.deep.equal([]);
      });

      testMethod(`passes with \`${template}\` when disabled via inline comment - single rule`, function() {
        let actual = verify(DISABLE_ONE + '\n' + template);

        expect(actual).to.deep.equal([]);
      });

      testMethod(`passes with \`${template}\` when disabled via inline comment - all rules`, function() {
        let actual = verify(DISABLE_ALL + '\n' + template);

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
