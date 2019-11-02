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

      result: {
        message: "Duplicate attribute 'firstName' found in the MustacheStatement.",
        moduleId: 'layout.hbs',
        source: '{{my-component firstName=firstName lastName=lastName firstName=firstName}}',
        line: 1,
        column: 53,
      },
    },
    {
      // BlockStatement
      template:
        '{{#my-component firstName=firstName  lastName=lastName firstName=firstName as |fullName|}}' +
        ' {{fullName}}' +
        '{{/my-component}}',

      result: {
        message: "Duplicate attribute 'firstName' found in the BlockStatement.",
        moduleId: 'layout.hbs',
        source:
          '{{#my-component firstName=firstName  lastName=lastName firstName=firstName as |fullName|}}' +
          ' {{fullName}}' +
          '{{/my-component}}',
        line: 1,
        column: 55,
      },
    },
    {
      // ElementNode
      template: '<a class="btn" class="btn">{{btnLabel}}</a>',

      result: {
        message: "Duplicate attribute 'class' found in the Element.",
        moduleId: 'layout.hbs',
        source: '<a class="btn" class="btn">{{btnLabel}}</a>',
        line: 1,
        column: 15,
      },
    },
    {
      // SubExpression
      template:
        '{{employee-profile employee=(hash firstName=firstName lastName=lastName age=age firstName=firstName)}}',

      result: {
        message: "Duplicate attribute 'firstName' found in the SubExpression.",
        moduleId: 'layout.hbs',
        source: '(hash firstName=firstName lastName=lastName age=age firstName=firstName)',
        line: 1,
        column: 80,
      },
    },
    {
      // SubExpression within a SubExpression
      template:
        '{{employee-profile employee=(hash fullName=(hash firstName=firstName lastName=lastName firstName=firstName) age=age)}}',

      result: {
        message: "Duplicate attribute 'firstName' found in the SubExpression.",
        moduleId: 'layout.hbs',
        source: '(hash firstName=firstName lastName=lastName firstName=firstName)',
        line: 1,
        column: 87,
      },
    },
  ],
});
