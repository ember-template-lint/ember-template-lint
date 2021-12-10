'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-aria-attributes',

  config: true,

  good: [
    '<h1 aria-hidden="true">Valid Heading</h1>',
    '<input type="email" aria-required="true" />',
    '<div role="slider" aria-valuenow={{this.foo}} aria-valuemax={{this.bar}} aria-valuemin={{this.baz}} />',
    '<div role="region" aria-live="polite">Valid live region</div>',
    '<CustomComponent @ariaRequired={{this.ariaRequired}} aria-errormessage="errorId" />',
  ],

  bad: [
    {
      template: '<input aria-text="inaccessible text" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria-text is not a valid ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<input aria-text=\\"inaccessible text\\" />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="slider" aria-valuenow={{this.foo}} aria-valuemax={{this.bar}} aria-value-min={{this.baz}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria-value-min is not a valid ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"slider\\" aria-valuenow={{this.foo}} aria-valuemax={{this.bar}} aria-value-min={{this.baz}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<h1 aria--hidden="true">Broken heading</h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria--hidden is not a valid ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<h1 aria--hidden=\\"true\\">Broken heading</h1>",
            },
          ]
        `);
      },
    },

    {
      template: '<CustomComponent role="region" aria-alert="polite" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria-alert is not a valid ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<CustomComponent role=\\"region\\" aria-alert=\\"polite\\" />",
            },
          ]
        `);
      },
    },
  ],
});
