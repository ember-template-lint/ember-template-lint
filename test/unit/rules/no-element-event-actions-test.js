'use strict';

const { parseConfig } = require('../../../lib/rules/no-element-event-actions');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-element-event-actions',

  config: true,

  good: [
    '<button></button>',
    '<button type="button" on={{action "myAction"}}></button>',
    '<button type="button" onclick="myFunction()"></button>',
    '<button type="button" {{action "myAction"}}></button>',
    '<button type="button" value={{value}}></button>',
    '{{my-component onclick=(action "myAction") someProperty=true}}',
    '<SiteHeader @someFunction={{action "myAction"}} @user={{this.user}} />',
    '<button type="button" onclick={{this.myAction}}></button>',
    {
      config: { requireActionHelper: true },
      template: '<button type="button" onclick={{this.myAction}}></button>',
    },
    {
      config: { requireActionHelper: false },
      template: '<button type="button" onclick="myFunction()"></button>',
    },
  ],

  bad: [
    {
      template:
        '<button onclick={{action "myAction"}} ONFOCUS={{action "myAction"}} otherProperty=true></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{action \\"myAction\\"}}",
            },
            Object {
              "column": 38,
              "endColumn": 67,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "ONFOCUS={{action \\"myAction\\"}}",
            },
          ]
        `);
      },
    },

    {
      template: '<SiteHeader onclick={{action "myAction"}} @user={{this.user}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{action \\"myAction\\"}}",
            },
          ]
        `);
      },
    },

    {
      config: { requireActionHelper: false },
      template: '<button type="button" onclick={{this.myAction}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{this.myAction}}",
            },
          ]
        `);
      },
    },
  ],
});

describe('no-element-event-actions', () => {
  describe('parseConfig', () => {
    const TESTS = [
      [true, { requireActionHelper: true }],
      [{ requireActionHelper: true }, { requireActionHelper: true }],
      [{ requireActionHelper: false }, { requireActionHelper: false }],
    ];

    for (let [input, expected] of TESTS) {
      test(`${JSON.stringify(input)} -> ${JSON.stringify(expected)}`, () => {
        expect(parseConfig(input)).toEqual(expected);
      });
    }

    const FAILURE_TESTS = [
      null,
      'error',
      { invalidOption: true },
      { requireActionHelper: 'true' },
    ];

    for (let input of FAILURE_TESTS) {
      test(`${JSON.stringify(input)} -> Error`, () => {
        expect(() => parseConfig(input)).toThrow();
      });
    }
  });
});
