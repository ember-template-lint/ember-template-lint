'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'quotes',

  good: [
    {
      config: 'double',
      template: '{{component "test"}}',
    },
    {
      config: 'double',
      template: '{{hello x="test"}}',
    },
    {
      config: 'double',
      template: '<input type="checkbox">',
    },
    {
      config: 'single',
      template: "{{component 'test'}}",
    },
    {
      config: 'single',
      template: "{{hello x='test'}}",
    },
    {
      config: 'single',
      template: "<input type='checkbox'>",
    },
  ],

  bad: [
    {
      config: 'double',
      template: "{{component 'test'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{component 'test'}}",
            },
          ]
        `);
      },
    },
    {
      config: 'double',
      template: "{{hello x='test'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "x='test'",
            },
          ]
        `);
      },
    },
    {
      config: 'double',
      template: "<input type='checkbox'>",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "type='checkbox'",
            },
          ]
        `);
      },
    },
    {
      config: 'single',
      template: '{{component "test"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{component \\"test\\"}}",
            },
          ]
        `);
      },
    },
    {
      config: 'single',
      template: '{{hello x="test"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "x=\\"test\\"",
            },
          ]
        `);
      },
    },
    {
      config: 'single',
      template: '<input type="checkbox">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "type=\\"checkbox\\"",
            },
          ]
        `);
      },
    },
  ],

  error: [
    {
      config: 'sometimes',
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `"sometimes"`',
      },
    },
    {
      config: true,
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `true`',
      },
    },
  ],
});
