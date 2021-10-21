// no-whitespace-for-layout-test.js

'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-whitespace-for-layout');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-whitespace-for-layout',
  config: true,

  good: [
    'Start to finish',
    'Start&nbsp;to&nbsp;finish',
    'Start<br>to<br>finish',
    '<div>\n  example\n</div>',
    '<div\n  foo="bar"\n  baz="qux"\n>\n  example\n</div>',
  ],

  bad: [
    {
      template: 'START  FINISH',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace detected.",
              "rule": "no-whitespace-for-layout",
              "severity": 2,
              "source": "START  FINISH",
            },
          ]
        `);
      },
    },
    {
      template: 'START&nbsp;&nbsp;FINISH',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace detected.",
              "rule": "no-whitespace-for-layout",
              "severity": 2,
              "source": "START&nbsp;&nbsp;FINISH",
            },
          ]
        `);
      },
    },
    {
      template: 'START&nbsp; FINISH',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace detected.",
              "rule": "no-whitespace-for-layout",
              "severity": 2,
              "source": "START&nbsp; FINISH",
            },
          ]
        `);
      },
    },
    {
      template: 'START &nbsp;FINISH',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace detected.",
              "rule": "no-whitespace-for-layout",
              "severity": 2,
              "source": "START &nbsp;FINISH",
            },
          ]
        `);
      },
    },
  ],
});
