'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-valueless-arguments');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-valueless-arguments',

  config: true,

  good: [
    '<SomeComponent @emptyString="" data-test-some-component />',
    `<button type="submit" disabled {{on "click" this.submit}}></button>`,
  ],

  bad: [
    {
      template: '<SomeComponent @valueless />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Named arguments should have an explicitly assigned value.",
              "rule": "no-valueless-arguments",
              "severity": 2,
              "source": "@valueless",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeComponent @valuelessByAccident{{this.canBeAModifier}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Named arguments should have an explicitly assigned value.",
              "rule": "no-valueless-arguments",
              "severity": 2,
              "source": "@valuelessByAccident",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeComponent @valuelessByAccident{{@canBeAModifier}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Named arguments should have an explicitly assigned value.",
              "rule": "no-valueless-arguments",
              "severity": 2,
              "source": "@valuelessByAccident",
            },
          ]
        `);
      },
    },
  ],
});
