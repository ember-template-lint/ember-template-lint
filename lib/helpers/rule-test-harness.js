import assert from 'node:assert';

import { processRules } from '../get-config.js';
import Linter from '../linter.js';

export const ConfigDefaults = {
  filePath: 'layout.hbs',
  workingDir: '.',
};

function getVerifyOptions(template, meta) {
  const options = {
    source: template,
    filePath: meta.filePath,
    workingDir: meta.workingDir,
  };
  if ('configResolver' in meta) {
    options.configResolver = meta.configResolver;
  }
  return options;
}

function cloneSimpleObject(obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}

const ALLOWED_GENERATE_RULE_TEST_PROPERTIES = new Set([
  'bad',
  'config',
  'error',
  'focusMethod',
  'good',
  'groupMethodBefore',
  'groupingMethod',
  'meta',
  'name',
  'plugins',
  'skipDisabledTests',
  'testMethod',
]);

const ALLOWED_TEST_CASE_PROPERTIES_GOOD = new Set(['config', 'meta', 'name', 'template']);

const ALLOWED_TEST_CASE_PROPERTIES_BAD = new Set([
  'config',
  'fixedTemplate', // Only in bad test cases.
  'meta',
  'name',
  'result',
  'results',
  'template',
  'verifyResults',
  'skipDisabledTests',
]);

const ALLOWED_TEST_CASE_PROPERTIES_ERROR = new Set([
  'config',
  'meta',
  'name',
  'result',
  'results',
  'template',
  'verifyResults',
]);

const ALLOWED_RESULT_PROPERTIES_BAD = new Set([
  'column',
  'endColumn',
  'endLine',
  'filePath',
  'isFixable', // Only in bad test cases.
  'line',
  'message',
  'rule',
  'severity',
  'source',
]);

const ALLOWED_RESULT_PROPERTIES_ERROR = new Set([
  'column',
  'endColumn',
  'endLine',
  'fatal', // Only in error test cases.
  'filePath',
  'line',
  'message',
  'rule',
  'severity',
  'source',
]);

function validateKeys(instance, allowedKeys, message) {
  for (const key of Object.keys(instance)) {
    assert(
      allowedKeys.has(key),
      `${message}: ${key}. Expected one of: ${[...allowedKeys.keys()].join(', ')}.`
    );
  }
}

function validateInput(args) {
  // Validate arguments.
  assert(args.length === 1, '`generateRuleTests` should only be called with one argument.');
  assert(
    typeof args === 'object',
    '`generateRuleTests` should only be called with an object argument.'
  );

  const [properties] = args;

  // Validate top-level properties.
  validateKeys(
    properties,
    ALLOWED_GENERATE_RULE_TEST_PROPERTIES,
    `Unexpected property passed to \`generateRuleTests\``
  );

  // Validate good test cases.
  for (const _item of properties.good || []) {
    let item = typeof _item === 'string' ? { template: _item } : _item;
    validateKeys(
      item,
      ALLOWED_TEST_CASE_PROPERTIES_GOOD,
      `Unexpected property passed to good test case`
    );
  }

  // Validate bad test cases.
  for (const item of properties.bad || []) {
    validateKeys(
      item,
      ALLOWED_TEST_CASE_PROPERTIES_BAD,
      `Unexpected property passed to bad test case`
    );

    assert(
      !(item.result && item.results),
      'Bad test case should not have both `result` and `results`.'
    );

    let results = item.results || (item.result ? [item.result] : []);
    for (const result of results) {
      validateKeys(
        result,
        ALLOWED_RESULT_PROPERTIES_BAD,
        `Unexpected property passed to bad test case results`
      );
    }
  }

  // Validate error test cases.
  for (const item of properties.error || []) {
    validateKeys(
      item,
      ALLOWED_TEST_CASE_PROPERTIES_ERROR,
      `Unexpected property passed to error test case`
    );

    assert(
      !(item.result && item.results),
      'Error test case should not have both `result` and `results`.'
    );

    let results = item.results || (item.result ? [item.result] : []);
    for (const result of results) {
      validateKeys(
        result,
        ALLOWED_RESULT_PROPERTIES_ERROR,
        `Unexpected property passed to error test case results`
      );
    }
  }
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
 * @param  {Object}   [meta]
 * @param  {Array}    plugins             - an array of plugins to load
 */
export default function generateRuleTests(...args) {
  validateInput(args);

  const [
    {
      bad = [],
      good = [],
      error = [],
      name,
      groupingMethod,
      groupMethodBefore,
      testMethod,
      focusMethod,
      skipDisabledTests,
      config: defaultConfig,
      meta: defaultMeta,
      plugins,
    },
  ] = args;

  groupingMethod(name, function () {
    let DISABLE_ALL = '{{! template-lint-disable }}';
    let DISABLE_ONE = `{{! template-lint-disable ${name} }}`;
    let DISABLE_ONE_LONG = `{{!-- template-lint-disable ${name} --}}`;

    let linter;
    let usedLinters = new WeakSet();

    function metaToObject(item) {
      const fallbackMeta = cloneSimpleObject(defaultMeta);
      if (typeof item !== 'object' || item === null) {
        return fallbackMeta;
      }
      if (typeof item.meta === 'object') {
        return cloneSimpleObject(item.meta);
      } else {
        return fallbackMeta;
      }
    }

    function parseMeta(item) {
      let meta = metaToObject(item);
      meta.filePath = 'filePath' in meta ? meta.filePath : ConfigDefaults.filePath;
      meta.workingDir = 'workingDir' in meta ? meta.workingDir : ConfigDefaults.workingDir;

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

    async function updateLinterConfig(localConfig) {
      if (localConfig === undefined) {
        return;
      }

      const config = await linter.getConfig();
      config.rules[name] = localConfig;
      config.rules = processRules(config);
    }

    /**
     * Prepare an individual snippet to be linted in a test:
     * - update linter config with the config passed along the snippet (optional)
     * - update linter workingDir
     * - return options, to be provided to linter
     *
     * @param {string|Object} item - a snippet to lint
     * @param {string} [item.template] - if item was an object, the snippet
     * @param {boolean|Object} localConfig - the config passed along the snippet
     * @returns {Object} options - options to pass to the linter instance
     */
    async function prepare(item, localConfig) {
      let template = typeof item === 'string' ? item : item.template;
      let meta = parseMeta(item);

      await updateLinterConfig(localConfig);
      linter.workingDir = meta.workingDir;

      return getVerifyOptions(template, meta);
    }

    groupMethodBefore(function () {
      let initialConfig = {
        plugins,
        rules: {},
      };
      initialConfig.rules[name] = defaultConfig;

      linter = new Linter({
        config: initialConfig,
      });
    });

    function parseResult(result, actual) {
      let defaults = {
        severity: 2,
      };

      // default the endLine/endColumn information so that adding them is not
      // a breaking change for existing users of the rule test harness (e.g.
      // plugin authors)
      if ('endLine' in actual) {
        defaults.endLine = actual.endLine;
      }
      if ('endColumn' in actual) {
        defaults.endColumn = actual.endColumn;
      }

      if (!skipDisabledTests) {
        defaults.rule = name;
      }

      if (typeof result.filePath !== 'string') {
        defaults.filePath = ConfigDefaults.filePath;
        delete result.filePath;
      }

      return Object.assign({}, defaults, result);
    }

    function checkLinterReuse() {
      if (usedLinters.has(linter)) {
        throw new Error(
          'ember-template-lint: Test harness found invalid setup (`groupingMethodBefore` not called once per test). Maybe you meant to pass `groupingMethodBefore: beforeEach`?'
        );
      }

      usedLinters.add(linter);
    }

    /**
     * Serialize test cases in such a way that we'll be able to conveniently check for duplicates.
     * @param {Object} item - test case object
     * @returns {string}
     */
    function serializeTestCase(item) {
      const itemCleanedAndSorted = {};
      const keysSorted = Object.keys(item).sort(); // Sort to ignore differences in the ordering of test case properties.
      for (const key of keysSorted) {
        if (typeof item[key] === 'function') {
          // Can't serialize functions (e.g. `verifyResults`) so just store them as a boolean since we only care about their presence and not their contents.
          itemCleanedAndSorted[key] = true;
        } else {
          itemCleanedAndSorted[key] = item[key];
        }
      }
      return JSON.stringify(itemCleanedAndSorted);
    }

    /**
     * If possible, check if this test case is a duplicate of one we have seen before.
     * @param {Object} item - test case object
     * @param {Set<String>} seenTestCases - set of serialized test cases we have seen so far (managed by this function)
     * @param {String} testCaseType - what type of test case we're running the check for
     */
    function checkDuplicateTestCase(item, seenTestCases, testCaseType) {
      if (['object', 'function'].includes(typeof item.config)) {
        // Functions can't be serialized.
        // Objects like RegExp can't be serialized.
        // So just ignore configs that can potentially not be serialized.
        return;
      }

      const serializedTestCase = serializeTestCase(item);
      assert(
        !seenTestCases.has(serializedTestCase),
        `detected duplicate \`${testCaseType}\` test case`
      );
      seenTestCases.add(serializedTestCase);
    }

    const seenBadTestCases = new Set();
    for (const item of bad) {
      let template = item.template;

      let shouldRunDisabledTests =
        'skipDisabledTests' in item ? !item.skipDisabledTests : !skipDisabledTests;
      let shouldFocus = item.focus === true && typeof focusMethod === 'function';
      let testOrOnly = shouldFocus ? focusMethod : testMethod;
      let testName = item.name || template;

      testOrOnly(`${testName}: logs errors`, async function () {
        checkLinterReuse();

        checkDuplicateTestCase(item, seenBadTestCases, 'bad');

        let options = await prepare(item, item.config);
        let actual = await linter.verify(options);

        assert(actual.length > 0, '`bad` test cases should always emit at least one failure');

        for (const violation of actual) {
          if (violation.isFixable) {
            assert(
              typeof item.fixedTemplate === 'string',
              'fixable test cases must assert the `fixedTemplate`'
            );
          }
        }

        if (actual.every((violation) => !violation.isFixable)) {
          assert(!item.fixedTemplate, 'non-fixable test cases should not provide `fixedTemplate`');
        }

        assert(
          item.template !== item.fixedTemplate,
          'Test case `template` should not equal the `fixedTemplate`'
        );

        if (item.fatal) {
          assert.strictEqual(actual.length, 1); // can't have more than one fatal error
          delete actual[0].source; // remove the source (stack trace is not easy to assert)
          assert.deepStrictEqual(actual[0], item.fatal);
        } else if (item.verifyResults) {
          item.verifyResults(actual);
        } else {
          if (!('result' in item) && !('results' in item)) {
            const hasRequiredProps = 'template' in item && 'fixedTemplate' in item;
            assert(
              hasRequiredProps,
              `\`bad\` test cases without "result" or "results" property supported only for template fixes with shape like { template: string, fixedTemplate: string }, given: ${JSON.stringify(
                item
              )}`
            );
          }

          // allow to have simple fixers tests, without result / results properties
          let results = item.results || (item.result ? [item.result] : []);

          if (results.length) {
            // assert only if given bad results exists
            let expectedResults = results.map((result, index) =>
              parseResult(result, actual[index])
            );
            assert.deepStrictEqual(actual, expectedResults);
          }
        }
      });

      if (shouldRunDisabledTests) {
        testOrOnly(`${testName}: passes when rule is disabled`, async function () {
          checkLinterReuse();

          let config = false;
          let options = await prepare(item, config);
          let actual = await linter.verify(options);

          assert.deepStrictEqual(actual, []);
        });

        testOrOnly(
          `${testName}: passes when disabled via inline comment - single rule`,
          async function () {
            checkLinterReuse();

            let options = await prepare(`${DISABLE_ONE}\n${template}`);
            let actual = await linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );

        testOrOnly(
          `${testName}: passes when disabled via long-form inline comment - single rule`,
          async function () {
            checkLinterReuse();

            let options = await prepare(`${DISABLE_ONE_LONG}\n${template}`);
            let actual = await linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );

        testOrOnly(
          `${testName}: passes when disabled via inline comment - all rules`,
          async function () {
            checkLinterReuse();

            let options = await prepare(`${DISABLE_ALL}\n${template}`);
            let actual = await linter.verify(options);

            assert.deepStrictEqual(actual, []);
          }
        );
      }

      if (item.fixedTemplate) {
        testOrOnly(`\`${item.template}\` -> ${item.fixedTemplate}\``, async function () {
          checkLinterReuse();

          let options = await prepare(item, item.config);

          let result = await linter.verifyAndFix(options);

          assert.deepStrictEqual(result.output, item.fixedTemplate);
        });

        testOrOnly(`${item.fixedTemplate}\` is idempotent`, async function () {
          checkLinterReuse();

          let options = await prepare(item, item.config);
          options.source = item.fixedTemplate;
          let result = await linter.verifyAndFix(options);

          assert.deepStrictEqual(result.output, item.fixedTemplate);
        });
      }
    }

    const seenGoodTestCases = new Set();
    for (const _item of good) {
      let item = typeof _item === 'string' ? { template: _item } : _item;
      let shouldFocus = item.focus === true && typeof focusMethod === 'function';
      let testOrOnly = shouldFocus ? focusMethod : testMethod;
      let testName = item.name || item.template;

      testOrOnly(`${testName}: passes`, async function () {
        checkLinterReuse();

        checkDuplicateTestCase(item, seenGoodTestCases, 'good');

        let options = await prepare(item, item.config);
        let actual = await linter.verify(options);

        assert.deepStrictEqual(actual, []);
      });
    }

    const seenErrorTestCases = new Set();
    for (const item of error) {
      let { name, config, template } = item;

      let shouldFocus = item.focus === true && typeof focusMethod === 'function';
      let testOrOnly = shouldFocus ? focusMethod : testMethod;
      let friendlyConfig = JSON.stringify(config);
      let testName = name || template;

      testOrOnly(`${testName}: errors with config \`${friendlyConfig}\``, async function () {
        checkLinterReuse();

        checkDuplicateTestCase(item, seenErrorTestCases, 'error');

        let options = await prepare(item, item.config);
        let actual = await linter.verify(options);

        let expectedResults = item.results || [item.result];
        expectedResults = expectedResults.map((result, index) =>
          parseResult(result, actual[index])
        );

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
    }
  });
}
