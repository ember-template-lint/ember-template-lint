'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-splattributes',

  config: true,

  good: [
    '<div ...attributes></div>',
    '<Foo ...attributes></Foo>',
    '<div ...attributes />',
    '<div><Foo ...attributes /></div>',
    '<div ...attributes></div><div></div>',
    '<div></div><div ...attributes></div><div></div>',
  ],

  bad: [
    {
      template: '<div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The root element in this template should use \`...attributes\`",
              "rule": "require-splattributes",
              "severity": 2,
              "source": "<div></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The root element in this template should use \`...attributes\`",
              "rule": "require-splattributes",
              "severity": 2,
              "source": "<Foo></Foo>",
            },
          ]
        `);
      },
    },
    {
      template: '<div></div><div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "At least one element in this template should use \`...attributes\`",
              "rule": "require-splattributes",
              "severity": 2,
              "source": "<div></div><div></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div/>\n\n',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The root element in this template should use \`...attributes\`",
              "rule": "require-splattributes",
              "severity": 2,
              "source": "<div/>",
            },
          ]
        `);
      },
    },
  ],
});
