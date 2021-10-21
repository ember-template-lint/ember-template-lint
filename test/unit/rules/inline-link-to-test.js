'use strict';

const { message } = require('../../../lib/rules/inline-link-to');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'inline-link-to',

  config: true,

  good: [
    "{{#link-to 'routeName' prop}}Link text{{/link-to}}",
    "{{#link-to 'routeName'}}Link text{{/link-to}}",
  ],

  bad: [
    {
      template: "{{link-to 'Link text' 'routeName'}}",
      fixedTemplate: "{{#link-to 'routeName'}}Link text{{/link-to}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The inline form of link-to is not allowed. Use the block form instead.",
              "rule": "inline-link-to",
              "severity": 2,
              "source": "{{link-to 'Link text' 'routeName'}}",
            },
          ]
        `);
      },
    },
    {
      template: "{{link-to 'Link text' 'routeName' one two}}",
      fixedTemplate: "{{#link-to 'routeName' one two}}Link text{{/link-to}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The inline form of link-to is not allowed. Use the block form instead.",
              "rule": "inline-link-to",
              "severity": 2,
              "source": "{{link-to 'Link text' 'routeName' one two}}",
            },
          ]
        `);
      },
    },
    {
      template: "{{link-to (concat 'Hello' @username) 'routeName' one two}}",
      fixedTemplate: "{{#link-to 'routeName' one two}}{{concat 'Hello' @username}}{{/link-to}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The inline form of link-to is not allowed. Use the block form instead.",
              "rule": "inline-link-to",
              "severity": 2,
              "source": "{{link-to (concat 'Hello' @username) 'routeName' one two}}",
            },
          ]
        `);
      },
    },
    {
      template: "{{link-to 1234 'routeName' one two}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "The inline form of link-to is not allowed. Use the block form instead.",
              "rule": "inline-link-to",
              "severity": 2,
              "source": "{{link-to 1234 'routeName' one two}}",
            },
          ]
        `);
      },
    },
  ],
});
