import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unused-block-params',

  config: true,

  good: [
    '{{cat}}',
    '{{#each cats as |cat|}}{{cat}}{{/each}}',
    '{{#each cats as |cat|}}{{partial "cat"}}{{/each}}',
    '{{#each cats as |cat|}}{{cat.name}}{{/each}}',
    '{{#each cats as |cat|}}{{meow cat}}{{/each}}',
    '{{#each cats as |cat index|}}{{index}}{{/each}}',
    '{{#each cats as |cat index|}}' +
      '{{#each cat.lives as |life|}}' +
      '{{index}}: {{life}}' +
      '{{/each}}' +
      '{{/each}}',
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        <MyOtherComponent .... @param={{param}} />
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        {{foo-bar param}}
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        {{param}}
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        {{foo-bar prop=param}}
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    {{#my-component as |param|}}
      {{! template-lint-disable }}
        <MyOtherComponent .... @param={{param}} />
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    `
    {{#my-component as |param|}}
      {{! template-lint-disable }}
        {{foo-bar param}}
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    `
    {{#my-component as |param|}}
      {{! template-lint-disable }}
        {{param}}
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    `
    {{#my-component as |param bar baz|}}
      {{! template-lint-disable }}
        {{foo-bar prop=param}}
      {{! template-lint-enable }}
      {{bar}}
      {{! template-lint-disable }}
        {{foo-bar prop=baz}}
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    '{{#each cats as |cat|}}{{#meow-meow cat as |cat|}}{{cat}}{{/meow-meow}}{{/each}}',
    '{{! template-lint-disable no-unused-block-params}}{{#each cats as |cat|}}Dogs{{/each}}',
    '{{#with (component "foo-bar") as |FooBar|}}<FooBar />{{/with}}',
    '<BurgerMenu as |menu|><header>Something</header><menu.item>Text</menu.item></BurgerMenu>',
    '{{#burger-menu as |menu|}}<header>Something</header>{{#menu.item}}Text{{/menu.item}}{{/burger-menu}}',
  ],

  bad: [
    {
      template: '{{#each cats as |cat|}}Dogs{{/each}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 23,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "'cat' is defined but never used",
              "rule": "no-unused-block-params",
              "severity": 2,
              "source": "Dogs",
            },
          ]
        `);
      },
    },
    {
      template: '{{#each cats as |cat index|}}{{cat}}{{/each}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 29,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "'index' is defined but never used",
              "rule": "no-unused-block-params",
              "severity": 2,
              "source": "{{cat}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{#each cats as |cat index|}}' +
        '{{#each cat.lives as |life index|}}' +
        '{{index}}: {{life}}' +
        '{{/each}}' +
        '{{/each}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 29,
              "endColumn": 92,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "'index' is defined but never used",
              "rule": "no-unused-block-params",
              "severity": 2,
              "source": "{{#each cat.lives as |life index|}}{{index}}: {{life}}{{/each}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{#each cats as |cat index|}}' +
        '{{partial "cat"}}' +
        '{{#each cat.lives as |life|}}Life{{/each}}' +
        '{{/each}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 75,
              "endColumn": 79,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "'life' is defined but never used",
              "rule": "no-unused-block-params",
              "severity": 2,
              "source": "Life",
            },
          ]
        `);
      },
    },
  ],
});
