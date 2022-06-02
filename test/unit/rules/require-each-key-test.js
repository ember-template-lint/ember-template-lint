import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-each-key',

  config: true,

  good: [
    '{{#each this.items key="id" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="deeply.nested.id" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="@index" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
    '{{#if foo}}{{/if}}',
  ],

  bad: [
    {
      template: '{{#each this.items as |item|}} {{item.name}} {{/each}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 54,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "{{#each}} helper requires a valid key value to avoid performance issues",
              "rule": "require-each-key",
              "severity": 2,
              "source": "{{#each this.items as |item|}} {{item.name}} {{/each}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#each this.items key="@invalid" as |item|}} {{item.name}} {{/each}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 69,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "{{#each}} helper requires a valid key value to avoid performance issues",
              "rule": "require-each-key",
              "severity": 2,
              "source": "{{#each this.items key=\\"@invalid\\" as |item|}} {{item.name}} {{/each}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#each this.items key="" as |item|}} {{item.name}} {{/each}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 61,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "{{#each}} helper requires a valid key value to avoid performance issues",
              "rule": "require-each-key",
              "severity": 2,
              "source": "{{#each this.items key=\\"\\" as |item|}} {{item.name}} {{/each}}",
            },
          ]
        `);
      },
    },
  ],
});
