'use strict';

const assert = require('assert');
const Linter = require('..');

function parseMeta(item) {
  let meta = item !== undefined && typeof item === 'object' && item.meta ? item.meta : {};
  meta.filePath = meta.filePath || 'layout.hbs';
  meta.moduleId = meta.moduleId || 'layout';
  const editorConfig = meta.editorConfig || {};

  if (!('configResolver' in meta)) {
    meta.configResolver = {
      editorConfig() {
        return editorConfig;
      },
    };
  }
  return meta;
}

function getVerifyOptions(template, meta) {
  const options = { source: template, filePath: meta.filePath, moduleId: meta.moduleId };
  if ('configResolver' in meta) {
    options.configResolver = meta.configResolver;
  }
  return options;
}

/**
 * allows tests to be defined without needing to setup test infrastructure every time
 * @param  {Array}  [bad=[]]            - an array of items that describe the use case that should fail
 *  [{
     name: 'prevents debugger',
     template: '{{debugger}}',

     result: {
       message,
       filePath: 'layout.hbs',
       moduleId: 'layout',
       source: '{{debugger}}',
       line: 1,
       column: 0,
     },
   }]
 *
 * @param  {Array}  [error=[]]            - an array of items that describe the use case that should error
 *  [{
     name: 'errors for "sometimes"',
     config: 'sometimes',
     template: 'test',

     result: {
       fatal: true,
       filePath: 'layout.hbs',
       moduleId: 'layout',
       message: 'You specified `"sometimes"`',
     },
   }]
 *
 * @param  {Array}    [good=[]]          - an array of items that should not fail
 * [
     '<img alt="hullo">',
     '<img alt={{foo}}>',
     '<img alt="blah {{derp}}">',
     '<img aria-hidden="true">',
     '<img alt="">',
     '<img alt>',
     {
       name: 'works with custom config',
       config: 'customized',
       template: '<img>',
     }
   ]
 *
 * @param  {String}   name                - a name to describe which lint rule is being tested
 * @param  {Function} groupingMethodEach  - function to call before test setup is defined (mocha - beforeEach, qunit - beforeEach)
 * @param  {Function} groupingMethod      - function to call when test setup is defined (mocha - describe, qunit - module)
 * @param  {Function} testMethod          - function to call when test block is to be run (mocha - it, qunit - test)
 * @param  {Function} [focusMethod]       - function to call when a specific test is to be run on its own (mocha - it.only, qunit - QUnit.only)
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
  //  TODO: deprecate and remove this argument
  groupMethodBefore, // eslint-disable-line no-unused-vars
  testMethod,
  focusMethod,
  skipDisabledTests,
  config: passedConfig,
  plugins,
}) {
  groupingMethod(name, function () {
    let DISABLE_ALL = '{{! template-lint-disable }}';
    let DISABLE_ONE = `{{! template-lint-disable ${name} }}`;
    let DISABLE_ONE_LONG = `{{!-- template-lint-disable ${name} --}}`;

    function copyPlugins() {
      let pluginsCopy;
      if (plugins && plugins.length > 0) {
        pluginsCopy = plugins.map(({ configurations, name, rules }) => {
          let configurationsCopy;
          if (configurations) {
            configurationsCopy = JSON.parse(JSON.stringify(configurations));
          }
          return { configurations: configurationsCopy, name, rules };
        });
      }
      return pluginsCopy;
    }

    /**
     * Create a linter instance
     *
     * @param {boolean|Object} localConfig - a config given at a snippet level
     * @returns {Object} options - the linter instance
     */
    function initLinter(localConfig) {
      let config = {
        plugins: copyPlugins(plugins),
        rules: {},
      };

      if (localConfig !== undefined) {
        config.rules[name] = localConfig;
      } else {
        config.rules[name] = passedConfig;
      }

      return new Linter({ config });
    }

    /**
     * Return options, to be provided to Linter
     *
     * @param {string|Object} item - a snippet to lint
     * @param {string} [item.template] - if item was an object, the snippet
     * @returns {Object} options - options to pass to the linter instance
     */
    function prepareOptions(item) {
      let template = typeof item === 'string' ? item : item.template;
      let meta = parseMeta(item);

      return getVerifyOptions(template, meta);
    }

    function parseResult(result) {
      let defaults = {
        severity: 2,
      };

      if (!skipDisabledTests) {
        defaults.rule = name;
      }

      if (result.filePath !== null) {
        defaults.filePath = 'layout.hbs';
      } else {
        delete result.filePath;
      }

      if (result.moduleId !== null) {
        defaults.moduleId = 'layout';
      } else {
        delete result.moduleId;
      }

      return Object.assign({}, defaults, result);
    }

    bad.forEach((item) => {
      let template = item.template;

      let shouldFocus = item.focus === true && typeof focusMethod === 'function';
      let testOrOnly = shouldFocus ? focusMethod : testMethod;
      let testName = item.name ? item.name : template;

      testOrOnly(`${testName}: logs errors`, function () {
        let linter = initLinter(item.config);

        let options = prepareOptions(item);
        let actual = linter.verify(options);

        if (item.fatal) {
          assert.strictEqual(actual.length, 1); // can't have more than one fatal error
          delete actual[0].source; // remove the source (stack trace is not easy to assert)
          assert.deepStrictEqual(actual[0], item.fatal);
        } else if (item.verifyResults) {
          item.verifyResults(actual);
        } else {
          let results = item.results || [item.result];
          let expectedResults = results.map(parseResult);

          assert.deepStrictEqual(actual, expectedResults);
        }
      });

      if (!skipDisabledTests) {
        testOrOnly(`${testName}: passes when rule is disabled`, function () {
          let config = false;
          let linter = initLinter(config);

          let options = prepareOptions(item);
          let actual = linter.verify(options);

          assert.deepStrictEqual(actual, []);
        });

        testOrOnly(
          `${testName}: passes when disabled via inline comment - single rule`,
          function () {
            let linter = initLinter();

            let options = prepareOptions(`${DISABLE_ONE}\n${template}`);
            let actual = linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );

        testOrOnly(
          `${testName}: passes when disabled via long-form inline comment - single rule`,
          function () {
            let linter = initLinter();

            let options = prepareOptions(`${DISABLE_ONE_LONG}\n${template}`);
            let actual = linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );

        testOrOnly(`${testName}: passes when disabled via inline comment - all rules`, function () {
          let linter = initLinter();

          let options = prepareOptions(`${DISABLE_ALL}\n${template}`);
          let actual = linter.verify(options);

          assert.deepStrictEqual(actual, []);
        });
      }

      if (item.fixedTemplate) {
        testOrOnly(`\`${item.template}\` -> ${item.fixedTemplate}\``, function () {
          let linter = initLinter(item.config);

          let options = prepareOptions(item.template);
          let result = linter.verifyAndFix(options);

          assert.deepStrictEqual(result.output, item.fixedTemplate);
        });

        testOrOnly(`${item.fixedTemplate}\` is idempotent`, function () {
          let linter = initLinter(item.config);

          let options = prepareOptions(item.fixedTemplate);
          let result = linter.verifyAndFix(options);

          assert.deepStrictEqual(result.output, item.fixedTemplate);
        });
      }
    });

    good.forEach((_item) => {
      let item = typeof _item === 'string' ? { template: _item } : _item;
      let shouldFocus = item.focus === true && typeof focusMethod === 'function';
      let testOrOnly = shouldFocus ? focusMethod : testMethod;
      let testName = item.name ? item.name : item.template;

      testOrOnly(`${testName}: passes`, function () {
        let linter = initLinter(item.config);

        let options = prepareOptions(item, item.config);
        let actual = linter.verify(options);

        assert.deepStrictEqual(actual, []);
      });
    });

    error.forEach((item) => {
      let { name, config, template } = item;

      let shouldFocus = item.focus === true && typeof focusMethod === 'function';
      let testOrOnly = shouldFocus ? focusMethod : testMethod;
      let friendlyConfig = JSON.stringify(config);
      let testName = name ? name : template;

      testOrOnly(`${testName}: errors with config \`${friendlyConfig}\``, function () {
        let linter = initLinter(item.config);

        let expectedResults = item.results || [item.result];
        expectedResults = expectedResults.map(parseResult);

        let options = prepareOptions(item);
        let actual = linter.verify(options);

        for (const [i, element] of actual.entries()) {
          if (element.fatal) {
            delete expectedResults[i].rule;
            delete element.source;

            assert.ok(element.message.includes(expectedResults[i].message));

            delete element.message;
            delete expectedResults[i].message;
          }
        }

        assert.deepStrictEqual(actual, expectedResults);
      });
    });
  });
};
