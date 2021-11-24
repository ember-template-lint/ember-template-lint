'use strict';

const path = require('path');

const defaultTestHarness = require('../../lib/helpers/rule-test-harness');
const Rule = require('../../lib/rules/_base');
const generateRuleTests = require('../helpers/rule-test-harness');

function verifyWithExternalSnapshot(results) {
  expect(results).toMatchSnapshot();
}

describe('rule public api', function () {
  describe('general test harness support', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'test',
          rules: {
            'no-elements': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    this.log({
                      message: 'Do not use any HTML elements!',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'no-elements',
      config: true,

      good: ['{{haha-wtf}}'],

      bad: [
        {
          name: 'uses static result - multiple',
          template: '<div></div><div></div>',
          results: [
            // does not need endLine/endColumn when using `results` style
            {
              column: 0,
              line: 1,
              message: 'Do not use any HTML elements!',
              source: '<div></div>',
            },
            {
              column: 11,
              line: 1,
              endColumn: 22,
              endLine: 1,
              message: 'Do not use any HTML elements!',
              source: '<div></div>',
            },
          ],
        },
        {
          name: 'uses static result',
          template: '<div></div>',
          result: {
            column: 0,
            line: 1,
            endColumn: 11,
            endLine: 1,
            message: 'Do not use any HTML elements!',
            source: '<div></div>',
          },
        },
        {
          name: 'uses static result - does not need endLine/endColumn',
          template: '<div></div>',
          result: {
            column: 0,
            line: 1,
            message: 'Do not use any HTML elements!',
            source: '<div></div>',
          },
        },
        {
          name: 'can use verifyResults directly (with inline snapshots)',
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "endColumn": 11,
                  "endLine": 1,
                  "filePath": "layout.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "rule": "no-elements",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
        {
          name: 'can use verifyResults directly (with external snapshots)',
          template: '<div></div>',
          verifyResults: verifyWithExternalSnapshot,
        },
      ],
    });
  });

  describe('async rule visitor support', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'test',
          rules: {
            'rule-with-async-visitor-hook': class extends Rule {
              async visitor() {
                await new Promise((resolve) => setTimeout(resolve, 10));
                return {
                  ElementNode(node) {
                    this.log({
                      message: 'Do not use any <promise> HTML elements!',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'rule-with-async-visitor-hook',
      config: true,

      good: ['{{haha-wtf}}'],

      bad: [
        {
          name: 'uses async visitor',
          template: '<promise></promise>',
          results: [
            {
              column: 0,
              line: 1,
              endColumn: 19,
              endLine: 1,
              message: 'Do not use any <promise> HTML elements!',
              source: '<promise></promise>',
            },
          ],
        },
      ],
    });
  });

  describe('mode === fix', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'fix-test',
          rules: {
            'can-fix': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    if (node.tag !== 'MySpecialThing') {
                      return;
                    }

                    if (this.mode === 'fix') {
                      node.tag = 'EvenBettererThing';
                    } else {
                      this.log({
                        isFixable: true,
                        message: 'Do not use MySpecialThing',
                        node,
                      });
                    }
                  },
                };
              }
            },
          },
        },
      ],

      name: 'can-fix',
      config: true,

      bad: [
        {
          template: '<MySpecialThing/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 17,
            endLine: 1,
            isFixable: true,
            message: 'Do not use MySpecialThing',
            source: '<MySpecialThing/>',
          },
          fixedTemplate: '<EvenBettererThing/>',
        },
        {
          template: '<MySpecialThing>contents here</MySpecialThing>',
          result: {
            column: 0,
            line: 1,
            endColumn: 46,
            endLine: 1,
            isFixable: true,
            message: 'Do not use MySpecialThing',
            source: '<MySpecialThing>contents here</MySpecialThing>',
          },
          fixedTemplate: '<EvenBettererThing>contents here</EvenBettererThing>',
        },
      ],
    });
  });

  describe('log results', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'log-test',
          rules: {
            'log-result': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    if (node.tag === 'MySpecialThingExplicit') {
                      this.log({
                        message: 'Do not use MySpecialThingExplicit',
                        node,
                      });
                    }

                    if (node.tag === 'MySpecialThingInferred') {
                      this.log({
                        message: 'Do not use MySpecialThingInferred',
                        node,
                      });
                    }

                    if (node.tag === 'MySpecialThingInferredDoesNotClobberExplicit') {
                      this.log({
                        message: 'Unclobbered error message',
                        node,
                        source: '<MySpecialThingInferredDoesNotClobberExplicit/>',
                      });
                    }
                  },
                };
              }
            },
          },
        },
      ],

      name: 'log-result',
      config: true,

      bad: [
        {
          template: '<MySpecialThingExplicit/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 25,
            endLine: 1,
            message: 'Do not use MySpecialThingExplicit',
            source: '<MySpecialThingExplicit/>',
          },
        },
        {
          template: '<MySpecialThingInferred/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 25,
            endLine: 1,
            message: 'Do not use MySpecialThingInferred',
            source: '<MySpecialThingInferred/>',
          },
        },
        {
          template: '<MySpecialThingInferredDoesNotClobberExplicit/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 47,
            endLine: 1,
            message: 'Unclobbered error message',
            source: '<MySpecialThingInferredDoesNotClobberExplicit/>',
          },
        },
      ],
    });
  });

  describe('local properties', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'local-properties-test',
          rules: {
            'no-html-in-files': class extends Rule {
              visitor() {
                let fileMatches =
                  path.posix.join(this.workingDir, this.filePath) === 'foo/bar/baz.hbs';

                return {
                  ElementNode(node) {
                    if (!fileMatches) {
                      return;
                    }

                    this.log({
                      message: 'Do not use any HTML elements!',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'no-html-in-files',
      config: true,

      bad: [
        {
          meta: {
            filePath: 'foo/bar/baz.hbs',
          },
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "endColumn": 11,
                  "endLine": 1,
                  "filePath": "foo/bar/baz.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "rule": "no-html-in-files",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
        {
          meta: {
            filePath: 'baz.hbs',
            workingDir: 'foo/bar',
          },
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "endColumn": 11,
                  "endLine": 1,
                  "filePath": "baz.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "rule": "no-html-in-files",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
      ],
    });
  });

  describe('with wrong number of arguments passed to generateRuleTests', function () {
    expect(() => generateRuleTests({}, {})).toThrowErrorMatchingInlineSnapshot(
      `"\`generateRuleTests\` should only be called with one argument."`
    );
  });

  describe('with invalid argument type passed to generateRuleTests', function () {
    expect(() => generateRuleTests(123)).toThrowErrorMatchingInlineSnapshot(
      `"\`generateRuleTests\` should only be called with an object argument."`
    );
  });

  describe('with invalid property in good test case', function () {
    expect(() =>
      generateRuleTests({
        good: [{ foo: true }],
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected property passed to good test case: foo. Expected one of: config, meta, name, template."`
    );
  });

  describe('with invalid property in bad test case', function () {
    expect(() =>
      generateRuleTests({
        bad: [{ foo: true }],
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected property passed to bad test case: foo. Expected one of: config, fixedTemplate, meta, name, result, results, template, verifyResults."`
    );
  });

  describe('with both `result` and `results` in bad test case', function () {
    expect(() =>
      generateRuleTests({
        bad: [{ result: {}, results: [] }],
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad test case should not have both \`result\` and \`results\`."`
    );
  });

  describe('with invalid property in bad test case result', function () {
    expect(() =>
      generateRuleTests({
        bad: [{ results: [{ fatal: true }] }], // `fatal` only allowed in error test cases.
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected property passed to bad test case results: fatal. Expected one of: column, endColumn, endLine, filePath, isFixable, line, message, rule, severity, source."`
    );
  });

  describe('with invalid property in error test case', function () {
    expect(() =>
      generateRuleTests({
        error: [{ fixedTemplate: true }], // `fixedTemplate` only allowed in bad test cases.
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected property passed to error test case: fixedTemplate. Expected one of: config, meta, name, result, results, template, verifyResults."`
    );
  });

  describe('with both `result` and `results` in error test case', function () {
    expect(() =>
      generateRuleTests({
        error: [{ result: {}, results: [] }],
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error test case should not have both \`result\` and \`results\`."`
    );
  });

  describe('with invalid property in error test case result', function () {
    expect(() =>
      generateRuleTests({
        error: [{ results: [{ isFixable: true }] }], // `isFixable` only allowed in bad test cases.
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected property passed to error test case results: isFixable. Expected one of: column, endColumn, endLine, fatal, filePath, line, message, rule, severity, source."`
    );
  });
});

describe('regression tests', function () {
  class Group {
    constructor(name, callback) {
      this.name = name;
      this.populateTests = callback;
      this.tests = [];
      this.beforeAll = [];
      this.beforeEach = [];
      this.runLog = null;
    }

    async run() {
      this.runLog = [];

      await this.populateTests();

      for (let callback of this.beforeAll) {
        await callback();
      }

      for (let test of this.tests) {
        for (let callback of this.beforeEach) {
          await callback();
        }

        await test.run();

        this.runLog.push(test.name);
      }
    }
  }

  class Test {
    constructor(name, callback) {
      this.name = name;
      this.run = callback;
    }
  }

  test('avoids config state mutation across tests', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        group.beforeEach.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      name: 'rule-with-async-visitor-hook',
      config: 'lol',

      plugins: [
        {
          name: 'rule-with-async-visitor-hook',
          rules: {
            'rule-with-async-visitor-hook': class extends Rule {
              async visitor() {
                await new Promise((resolve) => setTimeout(resolve, 10));

                return {
                  ElementNode(node) {
                    this.log({
                      message: `Current configuration is ${this.config}`,
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      good: [],

      bad: [
        {
          config: 'foo',
          template: `<div></div>`,
          result: {
            message: 'Current configuration is foo',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
        {
          // no config
          template: `<div></div>`,
          result: {
            message: 'Current configuration is lol',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
      ],
    });

    // should not fail
    await group.run();

    expect(group.runLog).toMatchInlineSnapshot(`
      Array [
        "<div></div>: logs errors",
        "<div></div>: passes when rule is disabled",
        "<div></div>: passes when disabled via inline comment - single rule",
        "<div></div>: passes when disabled via long-form inline comment - single rule",
        "<div></div>: passes when disabled via inline comment - all rules",
        "<div></div>: logs errors",
        "<div></div>: passes when rule is disabled",
        "<div></div>: passes when disabled via inline comment - single rule",
        "<div></div>: passes when disabled via long-form inline comment - single rule",
        "<div></div>: passes when disabled via inline comment - all rules",
      ]
    `);
  });

  test('throws a helpful error if test harness is setup incorrectly', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        // this is the main difference between the prior test,
        // this is using a "beforeAll` concept which _would_ introduce
        // leakage; so it should force an error during the test runs
        group.beforeAll.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      name: 'rule-with-async-visitor-hook',
      config: 'lol',

      plugins: [
        {
          name: 'rule-with-async-visitor-hook',
          rules: {
            'rule-with-async-visitor-hook': class extends Rule {
              async visitor() {
                await new Promise((resolve) => setTimeout(resolve, 10));

                return {
                  ElementNode(node) {
                    this.log({
                      message: `Current configuration is ${this.config}`,
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      good: [],

      bad: [
        {
          config: 'foo',
          template: `<div></div>`,
          result: {
            message: 'Current configuration is foo',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
        {
          // no config; when using beforeAll instead of beforeEach the bad test
          // just above changes the shared config (for the tests around "when
          // disabled") and causes _this_ bad test to not emit any errors
          template: `<div></div>`,
          result: {
            message: 'Current configuration is lol',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
      ],
    });

    await expect(() => group.run()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"ember-template-lint: Test harness found invalid setup (\`groupingMethodBefore\` not called once per test). Maybe you meant to pass \`groupingMethodBefore: beforeEach\`?"`
    );

    expect(group.runLog).toMatchInlineSnapshot(`
      Array [
        "<div></div>: logs errors",
      ]
    `);
  });

  test('with fixable test missing `fixedTemplate` assertion', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        group.beforeEach.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      plugins: [
        {
          name: 'fix-test',
          rules: {
            'can-fix': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    if (node.tag !== 'MySpecialThing') {
                      return;
                    }

                    if (this.mode === 'fix') {
                      node.tag = 'EvenBettererThing';
                    } else {
                      this.log({
                        isFixable: true,
                        message: 'Do not use MySpecialThing',
                        node,
                      });
                    }
                  },
                };
              }
            },
          },
        },
      ],

      name: 'can-fix',
      config: true,

      bad: [
        {
          // missing `fixedTemplate`
          template: '<MySpecialThing/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 17,
            endLine: 1,
            isFixable: true,
            message: 'Do not use MySpecialThing',
            source: '<MySpecialThing/>',
          },
        },
      ],
    });

    await expect(() => group.run()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"fixable test cases must assert the \`fixedTemplate\`"`
    );
  });

  test('with non-fixable test including `fixedTemplate` assertion', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        group.beforeEach.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      bad: [
        {
          template: '<MySpecialThing/>',
          fixedTemplate: '<EvenBettererThing/>',
        },
      ],
    });

    await expect(() => group.run()).rejects.toThrowErrorMatchingInlineSnapshot(
      '"non-fixable test cases should not provide `fixedTemplate`"'
    );
  });

  test('when only one of two violations provides a fix', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        group.beforeEach.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      plugins: [
        {
          name: 'fix-test',
          rules: {
            'can-fix': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    if (this.mode === 'fix') {
                      node.tag = 'EvenBettererThing';
                    } else {
                      this.log({
                        isFixable: true,
                        message: 'Do not use MySpecialThing',
                        node,
                      });
                      this.log({
                        isFixable: false,
                        message: 'Do not use MySpecialThing',
                        node,
                      });
                    }
                  },
                };
              }
            },
          },
        },
      ],

      name: 'can-fix',
      config: true,

      bad: [
        {
          template: '<MySpecialThing/>',
          fixedTemplate: '<EvenBettererThing/>',
        },
      ],
    });

    await group.run(); // runs successfully since we asserted `fixedTemplate`
  });

  test('when `template` = `fixedTemplate`', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        group.beforeEach.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      plugins: [
        {
          name: 'fix-test',
          rules: {
            'can-fix': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    this.log({
                      isFixable: true,
                      message: 'Do not use MySpecialThing',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'can-fix',
      config: true,

      bad: [
        {
          template: '<MySpecialThing/>',
          fixedTemplate: '<MySpecialThing/>',
        },
      ],
    });

    await expect(() => group.run()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Test case \`template\` should not equal the \`fixedTemplate\`"`
    );
  });
});
