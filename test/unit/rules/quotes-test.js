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

      result: {
        message: 'you must use double quotes in templates',
        line: 1,
        column: 12,
        source: "{{component 'test'}}",
      },
    },
    {
      config: 'double',
      template: "{{hello x='test'}}",

      result: {
        message: 'you must use double quotes in templates',
        line: 1,
        column: 10,
        source: "x='test'",
      },
    },
    {
      config: 'double',
      template: "<input type='checkbox'>",

      result: {
        message: 'you must use double quotes in templates',
        line: 1,
        column: 7,
        source: "type='checkbox'",
      },
    },
    {
      config: 'single',
      template: '{{component "test"}}',

      result: {
        message: 'you must use single quotes in templates',
        line: 1,
        column: 12,
        source: '{{component "test"}}',
      },
    },
    {
      config: 'single',
      template: '{{hello x="test"}}',

      result: {
        message: 'you must use single quotes in templates',
        line: 1,
        column: 10,
        source: 'x="test"',
      },
    },
    {
      config: 'single',
      template: '<input type="checkbox">',

      result: {
        message: 'you must use single quotes in templates',
        line: 1,
        column: 7,
        source: 'type="checkbox"',
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
