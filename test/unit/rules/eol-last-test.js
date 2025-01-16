import generateRuleTests from '../../helpers/rule-test-harness.js';

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
      config: 'always',
      template: '<img>\n',
    },
    {
      config: 'never',
      template: 'test',
    },
    {
      config: 'never',
      template: '<img>',
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
    // test that the config is ignored when the template is embedded, because this rule
    // is meant for newlines at the end of files, not for templates themselves.
    {
      config: 'always',
      template: [
        "import { hbs } from 'ember-cli-htmlbars';",
        '',
        "test('it renders', async (assert) => {",
        '  await render(hbs`<img>`);',
        ');',
      ].join('\n'),
      meta: {
        filePath: 'layout.js',
      },
    },
  ],

  bad: [
    {
      config: 'always',
      template: 'test',
      fixedTemplate: 'test\n',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 4,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template must end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "test",
            },
          ]
        `);
      },
    },
    {
      config: 'always',
      template: '<img>',
      fixedTemplate: '<img>\n',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template must end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "<img>",
            },
          ]
        `);
      },
    },
    {
      config: 'never',
      template: 'test\n',
      fixedTemplate: 'test',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 0,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template cannot end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "test
          ",
            },
          ]
        `);
      },
    },
    {
      config: 'never',
      template: '<img>\n',
      fixedTemplate: '<img>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 0,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template cannot end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "<img>
          ",
            },
          ]
        `);
      },
    },
    /*
    {
      config: 'editorconfig',
      template: 'test',
      fixedTemplate: 'test', // TODO: bug https://github.com/ember-template-lint/ember-template-lint/issues/2232

      meta: {
        editorConfig: { insert_final_newline: true },
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 4,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template must end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "test",
            },
          ]
        `);
      },
    },
    {
      config: 'editorconfig',
      template: 'test\n',
      fixedTemplate: 'test\n', // TODO: bug https://github.com/ember-template-lint/ember-template-lint/issues/2232

      meta: {
        editorConfig: { insert_final_newline: false },
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 0,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template cannot end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "test
          ",
            },
          ]
        `);
      },
    },
    */
    // test the re-entering of yielded content
    // only generates one error instead of two
    {
      config: 'never',
      template: '{{#my-component}}\n' + '  test\n' + '{{/my-component}}\n',
      fixedTemplate: '{{#my-component}}\n' + '  test\n' + '{{/my-component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 0,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "template cannot end with newline",
              "rule": "eol-last",
              "severity": 2,
              "source": "{{#my-component}}
            test
          {{/my-component}}
          ",
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
      config: 'editorconfig',
      template: 'test',
      meta: {
        editorConfig: {},
      },

      result: {
        fatal: true,
        message:
          'allows setting the configuration to `"editorconfig"`, _only_ when an `.editorconfig` file with the `insert_final_newline` setting exists',
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
