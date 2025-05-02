// no-whitespace-for-layout-test.js

import generateRuleTests from '../../helpers/rule-test-harness.js';

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
          [
            {
              "column": 0,
              "endColumn": 13,
              "endLine": 1,
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
          [
            {
              "column": 0,
              "endColumn": 23,
              "endLine": 1,
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
          [
            {
              "column": 0,
              "endColumn": 18,
              "endLine": 1,
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
          [
            {
              "column": 0,
              "endColumn": 18,
              "endLine": 1,
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
