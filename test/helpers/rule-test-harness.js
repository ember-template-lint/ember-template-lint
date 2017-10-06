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

    options.bad.forEach(function(badItem) {
      let template = badItem.template;
      let testMethod = badItem.focus ? it.only : it;

      it(`logs a message in the console when given \`${template}\``, function() {
        let expectedResults = badItem.results || [badItem.result];

        expectedResults = expectedResults.map(parseResult);

        if (badItem.config) {
          config = badItem.config;
        }

        let actual = verify(template);

        expect(actual).to.deep.equal(expectedResults);
      });

      it(`passes with \`${template}\` when rule is disabled`, function() {
        config = false;
        let actual = verify(template);

        expect(actual).to.deep.equal([]);
      });

      testMethod(`passes with \`${template}\` when disabled via inline comment - single rule`, function() {
        let actual = verify(DISABLE_ONE + '\n' + template);

        expect(actual).to.deep.equal([]);
      });

      it(`passes with \`${template}\` when disabled via inline comment - all rules`, function() {
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

    let error = options.error || [];
    error.forEach(item => {
      let template = item.template;
      let testMethod = item.focus ? it.only : it;

      if (item.config !== undefined) {
        config = item.config;
      }

      let friendlyConfig = JSON.stringify(config);

      let _config = config;

      testMethod(`errors when given \`${template}\` with config \`${friendlyConfig}\``, function() {
        let expectedResults = item.results || [item.result];

        expectedResults = expectedResults.map(parseResult);

        config = _config;

        let actual = verify(template);

        for (let i = 0; i < actual.length; i++) {
          if (actual[i].fatal) {
            delete expectedResults[i].rule;
            delete actual[i].source;

            expect(actual[i].message).to.contain(expectedResults[i].message);

            delete actual[i].message;
            delete expectedResults[i].message;
          }
        }

        expect(actual).to.deep.equal(expectedResults);
      });
    });
  });
};
