'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-duplicate-attributes',

  config: true,

  good: [
    // MustacheStatement
    '{{my-component firstName=firstName lastName=lastName}}',
    // BlockStatement
    '{{#my-component firstName=firstName  lastName=lastName as |fullName|}}' +
      ' {{fullName}}' +
      '{{/my-component}}',
    // Element Node
    '<a class="btn">{{btnLabel}}</a>',
    // SubExpression
    '{{employee-profile employee=(hash firstName=firstName lastName=lastName age=age)}}',
    // SubExpression within a SubExpression
    '{{employee-profile employee=(hash fullName=(hash firstName=firstName lastName=lastName) age=age)}}',
  ],

  bad: [
    {
      // MustacheStatement
      template: '{{my-component firstName=firstName lastName=lastName firstName=firstName}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 53,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Duplicate attribute 'firstName' found in the MustacheStatement.",
              "rule": "no-duplicate-attributes",
              "severity": 2,
              "source": "{{my-component firstName=firstName lastName=lastName firstName=firstName}}",
            },
          ]
        `);
      },
    },
    {
      // BlockStatement
      template:
        '{{#my-component firstName=firstName  lastName=lastName firstName=firstName as |fullName|}}' +
        ' {{fullName}}' +
        '{{/my-component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 55,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Duplicate attribute 'firstName' found in the BlockStatement.",
              "rule": "no-duplicate-attributes",
              "severity": 2,
              "source": "{{#my-component firstName=firstName  lastName=lastName firstName=firstName as |fullName|}} {{fullName}}{{/my-component}}",
            },
          ]
        `);
      },
    },
    {
      // ElementNode
      template: '<a class="btn" class="btn">{{btnLabel}}</a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Duplicate attribute 'class' found in the Element.",
              "rule": "no-duplicate-attributes",
              "severity": 2,
              "source": "<a class=\\"btn\\" class=\\"btn\\">{{btnLabel}}</a>",
            },
          ]
        `);
      },
    },
    {
      // SubExpression
      template:
        '{{employee-profile employee=(hash firstName=firstName lastName=lastName age=age firstName=firstName)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 80,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Duplicate attribute 'firstName' found in the SubExpression.",
              "rule": "no-duplicate-attributes",
              "severity": 2,
              "source": "(hash firstName=firstName lastName=lastName age=age firstName=firstName)",
            },
          ]
        `);
      },
    },
    {
      // SubExpression within a SubExpression
      template:
        '{{employee-profile employee=(hash fullName=(hash firstName=firstName lastName=lastName firstName=firstName) age=age)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 87,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Duplicate attribute 'firstName' found in the SubExpression.",
              "rule": "no-duplicate-attributes",
              "severity": 2,
              "source": "(hash firstName=firstName lastName=lastName firstName=firstName)",
            },
          ]
        `);
      },
    },
  ],
});
