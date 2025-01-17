import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-strict-mode',

  config: true,

  good: [
    {
      template: `<template>hello</template>`,
      meta: {
        filePath: 'hello.gjs',
      },
    },
    {
      template: `import Component from '@glimmer/component';

  export default HelloComponent extends Component {
    <template>hello</template>
  }`,
      meta: {
        filePath: 'hello.gjs',
      },
    },
  ],

  bad: [
    {
      template: `<div>
  hello
</div>`,
      meta: {
        filePath: 'hello.hbs',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 3,
              "filePath": "hello.hbs",
              "line": 1,
              "message": "Templates are required to be in strict mode. Consider refactoring to template tag format.",
              "rule": "require-strict-mode",
              "severity": 2,
              "source": "<div>
            hello
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: [
        "import { hbs } from 'ember-cli-htmlbars';",
        '',
        "test('it renders', async (assert) => {",
        '  await render(hbs`hello`);',
        '});',
      ].join('\n'),
      meta: {
        filePath: 'hello-test.js',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 24,
              "endLine": 4,
              "filePath": "hello-test.js",
              "line": 4,
              "message": "Templates are required to be in strict mode. Consider refactoring to template tag format.",
              "rule": "require-strict-mode",
              "severity": 2,
              "source": "hello",
            },
          ]
        `);
      },
    },
  ],
});
