import generateRuleTests from '../../helpers/rule-test-harness.js';

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
      fixedTemplate: '{{my-component firstName=firstName lastName=lastName}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 53,
              "endColumn": 72,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
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
      fixedTemplate:
        '{{#my-component firstName=firstName  lastName=lastName as |fullName|}}' +
        ' {{fullName}}' +
        '{{/my-component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 55,
              "endColumn": 74,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
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
      fixedTemplate: '<a class="btn">{{btnLabel}}</a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
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
      fixedTemplate:
        '{{employee-profile employee=(hash firstName=firstName lastName=lastName age=age)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 80,
              "endColumn": 99,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
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
      fixedTemplate:
        '{{employee-profile employee=(hash fullName=(hash firstName=firstName lastName=lastName) age=age)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 87,
              "endColumn": 106,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
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
