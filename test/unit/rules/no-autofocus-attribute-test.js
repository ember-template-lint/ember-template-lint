'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-autofocus-attribute',

  config: true,

  good: [
    '<input />',
    '<input type="text" disabled="true" />',
    '<input type="password" disabled={{false}} />',
    '{{input type="text" disabled=true}}',
  ],

  bad: [
    {
      template: '<input autofocus />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context",
              "rule": "no-autofocus-attribute",
              "severity": 2,
              "source": "autofocus",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="text" autofocus="true" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context",
              "rule": "no-autofocus-attribute",
              "severity": 2,
              "source": "autofocus=\\"true\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="text" autofocus={{false}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context",
              "rule": "no-autofocus-attribute",
              "severity": 2,
              "source": "autofocus={{false}}",
            },
          ]
        `);
      },
    },
    {
      template: '<input autofocus={{foo}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context",
              "rule": "no-autofocus-attribute",
              "severity": 2,
              "source": "autofocus={{foo}}",
            },
          ]
        `);
      },
    },
  ],
});
