'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-block-param-definition',

  config: true,

  good: [
    '<MyComponent as |foo|>{{foo}}</MyComponent>',
    `<FooBar
as |boo|>{{boo}}</FooBar>
`,
    `<FooBar
as | boo |>{{boo}}</FooBar>
`,
    `<FooBar
as
|boo|
>{{boo}}</FooBar>
`,
    `<FooBar
as
| boo |
  >{{boo}}</FooBar>
`,
    `<div>
  <MyComponent>
    {{#each this.foo as |bar|}}
      {{bar}}
    {{/each}}
  </MyComponent>
</div>
`,
    `<MyComponent as |boo|>
  <MyComponent>
    {{#each this.foo as |bar|}}
      {{bar}}{{boo}}
    {{else}}
      {{foo}}
    {{/each}}
  </MyComponent>
</MyComponent>
`,

    // Ensure comments are ignored:
    '<div {{! This is needed to serve as a container }}></div>',
    '<MyComponent {{! This is needed to serve as a container }}></MyComponent>',
  ],

  bad: [
    {
      template: '<Foo |a></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo |a>\\". Missing \\" as \\" keyword before block symbol \\"|\\". Missing second (closing) \\"|\\" block symbol.",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo |a>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo | a></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo | a>\\". Missing \\" as \\" keyword before block symbol \\"|\\".",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo | a>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo |a|></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo |a|>\\". Missing \\" as \\" keyword before block symbol \\"|\\".",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo |a|>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo | a |></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo | a |>\\". Missing \\" as \\" keyword before block symbol \\"|\\".",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo | a |>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo | a |></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo | a |>\\". Missing \\" as \\" keyword before block symbol \\"|\\".",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo | a |>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo a|></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo a|>\\". Missing \\" as \\" keyword before block symbol \\"|\\". Missing \\"|\\" block symbol after \\" as \\" keyword.",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo a|>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo a |></Foo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage in \\"<Foo a |>\\". Missing \\" as \\" keyword before block symbol \\"|\\".",
              "rule": "no-invalid-block-param-definition",
              "severity": 2,
              "source": "<Foo a |>",
            },
          ]
        `);
      },
    },
  ],
});
