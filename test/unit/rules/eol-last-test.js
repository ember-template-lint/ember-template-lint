'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'eol-last',

  good: [
    {
      config: 'editorconfig',
      template: 'test\n',
      meta: {
        editorConfig: { insert_final_newline: true },
      },
    },
    {
      config: 'editorconfig',
      template: 'test',
      meta: {
        editorConfig: { insert_final_newline: false },
      },
    },
    {
      config: 'always',
      template: 'test\n',
    },
    {
      config: 'never',
      template: 'test',
    },
    // test the re-entering of yielded content
    {
      config: 'never',
      template: '{{#my-component}}\n' + '  test\n' + '{{/my-component}}',
    },
    {
      config: 'always',
      template: '{{#my-component}}{{/my-component}}\n',
    },
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
        source: 'test',
      },
    },
    {
      config: 'never',
      template: 'test\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'template cannot end with newline',
        line: 1,
        column: 0,
        source: 'test\n',
      },
    },
    {
      config: 'editorconfig',
      template: 'test',

      meta: {
        editorConfig: { insert_final_newline: true },
      },

      result: {
        moduleId: 'layout.hbs',
        message: 'template must end with newline',
        line: 1,
        column: 0,
        source: 'test',
      },
    },
    {
      config: 'editorconfig',
      template: 'test\n',

      meta: {
        editorConfig: { insert_final_newline: false },
      },

      result: {
        moduleId: 'layout.hbs',
        message: 'template cannot end with newline',
        line: 1,
        column: 0,
        source: 'test\n',
      },
    },
    // test the re-entering of yielded content
    // only generates one error instead of two
    {
      config: 'never',
      template: '{{#my-component}}\n' + '  test\n' + '{{/my-component}}\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'template cannot end with newline',
        line: 1,
        column: 0,
        source: '{{#my-component}}\n' + '  test\n' + '{{/my-component}}\n',
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
      config: 'editorconfig',
      template: 'test',
      meta: {
        editorConfig: {},
      },

      result: {
        fatal: true,
        moduleId: 'layout.hbs',
        message:
          'allows setting the configuration to `"editorconfig"`, _only_ when an `.editorconfig` file with the `insert_final_newline` setting exists',
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
