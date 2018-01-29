'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'eol-last',

  good: [
    {
      config: 'always',
      template: 'test\n'
    },
    {
      config: 'never',
      template: 'test'
    },
    // test the re-entering of yielded content
    {
      config: 'never',
      template: '{{#my-component}}\n' +
      '  test\n' +
      '{{/my-component}}'
    },
    {
      config: 'always',
      template: '{{#my-component}}{{/my-component}}\n'
    }
  ],

  bad: [
    {
      config: 'always',
      template: 'test',

      result: {
        moduleId: 'layout.hbs',
        message: 'template must end with newline',
        line: 1,
        column: 0,
        source: 'test'
      }
    },
    {
      config: 'never',
      template: 'test\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'template cannot end with newline',
        line: 1,
        column: 0,
        source: 'test\n'
      }
    },
    // test the re-entering of yielded content
    // only generates one error instead of two
    {
      config: 'never',
      template: '{{#my-component}}\n' +
      '  test\n' +
      '{{/my-component}}\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'template cannot end with newline',
        line: 1,
        column: 0,
        source: '{{#my-component}}\n' +
        '  test\n' +
        '{{/my-component}}\n'
      }
    }
  ],

  error: [
    {
      config: 'sometimes',
      template: 'test',

      result: {
        fatal: true,
        moduleId: 'layout.hbs',
        message: 'You specified `"sometimes"`'
      }
    },
    {
      config: true,
      template: 'test',

      result: {
        fatal: true,
        moduleId: 'layout.hbs',
        message: 'You specified `true`'
      }
    }
  ]
});
