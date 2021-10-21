'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-button-type',

  config: true,

  good: [
    // valid static values
    '<button type="button" />',
    '<button type="button">label</button>',
    '<button type="submit" />',
    '<button type="reset" />',

    // dynamic values
    '<button type="{{buttonType}}" />',
    '<button type={{buttonType}} />',

    '<div/>',
    '<div></div>',
    '<div type="randomType"></div>',
  ],

  bad: [
    {
      template: '<button/>',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button/>",
            },
          ]
        `);
      },
    },
    {
      template: '<button>label</button>',
      fixedTemplate: '<button type="button">label</button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button>label</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="" />',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button type=\\"\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="foo" />',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button type=\\"foo\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type=42 />',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button type=42 />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button></button></form>',
      fixedTemplate: '<form><button type="submit"></button></form>',
    },
  ],
});
