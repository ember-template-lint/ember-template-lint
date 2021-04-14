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
      result: {
        message: 'The root element in this template should use `...attributes`',
        line: 1,
        column: 0,
        source: '<div></div>',
      },
    },
    {
      template: '<Foo></Foo>',
      result: {
        message: 'The root element in this template should use `...attributes`',
        line: 1,
        column: 0,
        source: '<Foo></Foo>',
      },
    },
    {
      template: '<div></div><div></div>',
      result: {
        message: 'At least one element in this template should use `...attributes`',
        line: 1,
        column: 0,
        source: '<div></div><div></div>',
      },
    },
    {
      template: '<div/>\n\n',
      result: {
        message: 'The root element in this template should use `...attributes`',
        line: 1,
        column: 0,
        source: '<div/>',
      },
    },
  ],
});
