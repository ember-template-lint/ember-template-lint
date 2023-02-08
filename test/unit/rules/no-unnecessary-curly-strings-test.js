import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unnecessary-curly-strings',

  config: true,

  good: [
    '<FooBar class="btn" />',
    '{{foo}}',
    '{{(foo)}}',
    '{{this.calculate 1 2 op="add"}}',
    '{{get address part}}',
    'foo',
    '"foo"',
    '<FooBar value=12345 />',
    '<FooBar value=null />',
    '<FooBar isTrue=true />',
    '<FooBar class=undefined />',
  ],

  bad: [
    {
      template: '<FooBar class={{"btn"}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unnecessary curly braces around StringLiteral",
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unnecessary curly braces around StringLiteral",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{\\"Foo\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<FooBar value={{12345}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unnecessary curly braces around NumberLiteral",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{12345}}",
            },
          ]
        `);
      },
    },
    {
      template: '<FooBar value={{null}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unnecessary curly braces around NullLiteral",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{null}}",
            },
          ]
        `);
      },
    },
    {
      template: '<FooBar isTrue={{true}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unnecessary curly braces around BooleanLiteral",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{true}}",
            },
          ]
        `);
      },
    },
    {
      template: '<FooBar isTrue={{undefined}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unnecessary curly braces around UndefinedLiteral",
              "rule": "no-unnecessary-curly-strings",
              "severity": 2,
              "source": "{{undefined}}",
            },
          ]
        `);
      },
    },
  ],
});
