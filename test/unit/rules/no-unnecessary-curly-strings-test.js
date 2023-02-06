import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unnecessary-curly-strings',

  config: true,

  good: ['<FooBar class="btn" />', '{{foo}}'],

  bad: [
    {
      template: '<FooBar class={{"btn"}} />',
      fixedTemplate: '<FooBar class="btn" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary curly braces around string",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{\\"btn\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<FooBar class="btn">{{"Foo"}}</FooBar>',
      fixedTemplate: '<FooBar class="btn">Foo</FooBar>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary curly braces around string",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{\\"Foo\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
