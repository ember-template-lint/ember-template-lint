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
        moduleId: 'layout.hbs',
        message: 'you must use double quotes in templates',
        line: 1,
        column: 12,
        source: "'test'",
      },
    },
    {
      config: 'double',
      template: "{{hello x='test'}}",

      result: {
        moduleId: 'layout.hbs',
        message: 'you must use double quotes in templates',
        line: 1,
        column: 10,
        source: "'test'",
      },
    },
    {
      config: 'double',
      template: "<input type='checkbox'>",

      result: {
        moduleId: 'layout.hbs',
        message: 'you must use double quotes in templates',
        line: 1,
        column: 12,
        source: "'checkbox'",
      },
    },
    {
      config: 'single',
      template: '{{component "test"}}',

      result: {
        moduleId: 'layout.hbs',
        message: 'you must use single quotes in templates',
        line: 1,
        column: 12,
        source: '"test"',
      },
    },
    {
      config: 'single',
      template: '{{hello x="test"}}',

      result: {
        moduleId: 'layout.hbs',
        message: 'you must use single quotes in templates',
        line: 1,
        column: 10,
        source: '"test"',
      },
    },
    {
      config: 'single',
      template: '<input type="checkbox">',

      result: {
        moduleId: 'layout.hbs',
        message: 'you must use single quotes in templates',
        line: 1,
        column: 12,
        source: '"checkbox"',
      },
    },
  ],

  error: [
    {
      config: 'sometimes',
      template: 'test',

      result: {
        fatal: true,
        moduleId: 'layout.hbs',
        message: 'You specified `"sometimes"`',
      },
    },
    {
      config: true,
      template: 'test',

      result: {
        fatal: true,
        moduleId: 'layout.hbs',
        message: 'You specified `true`',
      },
    },
  ],
});
