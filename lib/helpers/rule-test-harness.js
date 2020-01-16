'use strict';

const assert = require('assert');

const Linter = require('../index');

function parseMeta(item) {
  let meta = item !== undefined && typeof item === 'object' && item.meta ? item.meta : {};
  meta.moduleId = meta.moduleId || 'layout.hbs';

  return meta;
}

function getVerifyOptions(template, meta) {
  const options = { source: template, moduleId: meta.moduleId };
  if ('configResolver' in meta) {
    options.configResolver = meta.configResolver;
  }
  return options;
}

/**
 * allows tests to be defined without needing to setup test infrastructure every time
 * @param  {Array}  [bad=[]]            - an array of items that describe the use case that should fail
 *  [{
     template: '{{debugger}}',

     result: {
       message,
       moduleId: 'layout.hbs',
       source: '{{debugger}}',
       line: 1,
       column: 0,
     },
   }]
 *
 * @param  {Array}  [error=[]]            - an array of items that describe the use case that should error
 *  [{
     config: 'sometimes',
     template: 'test',

     result: {
       fatal: true,
       moduleId: 'layout.hbs',
       message: 'You specified `"sometimes"`',
     },
   }]
 *
 * @param  {Array}    [good=[]]          - an array of strings that define templates that should not fail
 * [
     '<img alt="hullo">',
     '<img alt={{foo}}>',
     '<img alt="blah {{derp}}">',
     '<img aria-hidden="true">',
     '<img alt="">',
     '<img alt>',
   ]
 *
 * @param  {String}   name                - a name to describe which lint rule is being tested
 * @param  {Function} groupingMethodEach  - function to call before test setup is defined (mocha - beforeEach, qunit - beforeEach)
 * @param  {Function} groupingMethod      - function to call when test setup is defined (mocha - describe, qunit - module)
 * @param  {Function} testMethod          - function to call when test block is to be run (mocha - it, qunit - test)
 * @param  {Boolean}  skipDisabledTests   - boolean to skip disabled tests or not
 * @param  {Object}   config
 * @param  {Array}    plugins             - an array of plugins to load
 */
module.exports = function generateRuleTests({
  bad = [],
  good = [],
  error = [],
  name,
  groupingMethod,
  groupMethodBefore,
  testMethod,
  skipDisabledTests,
  config: passedConfig,
  plugins,
}) {
  groupingMethod(name, function() {
    let DISABLE_ALL = '{{! template-lint-disable }}';
    let DISABLE_ONE = `{{! template-lint-disable ${name} }}`;
    let DISABLE_ONE_LONG = `{{!-- template-lint-disable ${name} --}}`;

    let linter;

    function updateLinterConfig(localConfig) {
      if (localConfig === undefined) {
        return;
      }

      linter.config.rules[name] = localConfig;
    }

    /**
     * Prepare an individual snippet to be linted in a test:
     * - update linter config with the config passed along the snippet (optional)
     * - return options, to be provided to linter
     *
     * @param {string|Object} item - a snippet to lint
     * @param {string} [item.template] - if item was an object, the snippet
     * @param {boolean|Object} localConfig - the config passed along the snippet
     * @returns {Object} options - options to pass to the linter instance
     */
    function prepare(item, localConfig) {
      let template = typeof item === 'string' ? item : item.template;
      let meta = parseMeta(item);

      updateLinterConfig(localConfig);

      return getVerifyOptions(template, meta);
    }

    groupMethodBefore(function() {
      let initialConfig = {
        plugins,
        rules: {},
      };
      initialConfig.rules[name] = passedConfig;

      linter = new Linter({
        config: initialConfig,
      });
    });

    function parseResult(result) {
      let defaults = {
        severity: 2,
      };

      if (!skipDisabledTests) {
        defaults.rule = name;
      }

      if (result.moduleId !== null) {
        defaults.moduleId = 'layout.hbs';
      } else {
        delete result.moduleId;
      }

      return Object.assign({}, defaults, result);
    }

    bad.forEach(function(badItem) {
      let template = badItem.template;

      testMethod(`logs a message in the console when given \`${template}\``, function() {
        let expectedResults = badItem.results || [badItem.result];

        let options = prepare(badItem, badItem.config);
        let actual = linter.verify(options);

        if (badItem.fatal) {
          assert.strictEqual(actual.length, 1); // can't have more than one fatal error
          delete actual[0].source; // remove the source (stack trace is not easy to assert)
          assert.deepStrictEqual(actual[0], badItem.fatal);
        } else {
          expectedResults = expectedResults.map(parseResult);

          assert.deepStrictEqual(actual, expectedResults);
        }
      });

      if (!skipDisabledTests) {
        testMethod(`passes with \`${template}\` when rule is disabled`, function() {
          let config = false;
          let options = prepare(badItem, config);
          let actual = linter.verify(options);

          assert.deepStrictEqual(actual, []);
        });

        testMethod(
          `passes with \`${template}\` when disabled via inline comment - single rule`,
          function() {
            let options = prepare(`${DISABLE_ONE}\n${template}`);
            let actual = linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );

        testMethod(
          `passes with \`${template}\` when disabled via long-form inline comment - single rule`,
          function() {
            let options = prepare(`${DISABLE_ONE_LONG}\n${template}`);
            let actual = linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );

        testMethod(
          `passes with \`${template}\` when disabled via inline comment - all rules`,
          function() {
            let options = prepare(`${DISABLE_ALL}\n${template}`);
            let actual = linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );
      }
    });

    good.forEach(function(goodItem) {
      let template = typeof goodItem === 'string' ? goodItem : goodItem.template;

      testMethod(`passes when given \`${template}\``, function() {
        let options = prepare(goodItem, goodItem.config);
        let actual = linter.verify(options);

        assert.deepStrictEqual(actual, []);
      });
    });

    error.forEach(item => {
      let { config, template } = item;

      let friendlyConfig = JSON.stringify(config);

      testMethod(`errors when given \`${template}\` with config \`${friendlyConfig}\``, function() {
        let expectedResults = item.results || [item.result];
        expectedResults = expectedResults.map(parseResult);

        let options = prepare(item, item.config);
        let actual = linter.verify(options);

        for (let i = 0; i < actual.length; i++) {
          if (actual[i].fatal) {
            delete expectedResults[i].rule;
            delete actual[i].source;

            assert.ok(actual[i].message.indexOf(expectedResults[i].message) > -1);

            delete actual[i].message;
            delete expectedResults[i].message;
          }
        }

        assert.deepStrictEqual(actual, expectedResults);
      });
    });
  });
};
