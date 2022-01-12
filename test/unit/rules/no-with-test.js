import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-with',

  config: true,

  good: [
    '{{@with}}',
    '{{this.with}}',
    '{{with "foo" bar="baz"}}',
    '{{#if @model.posts}}{{@model.posts}}{{/if}}',
    '{{#let @model.posts as |blogPosts|}}{{blogPosts}}{{/let}}',
  ],

  bad: [
    {
      template: '{{#with this.foo as |bar|}}{{bar}}{{/with}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The use of \`{{with}}\` has been deprecated. Please see the deprecation guide at https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax.",
              "rule": "no-with",
              "severity": 2,
              "source": "{{#with this.foo as |bar|}}{{bar}}{{/with}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{#with (hash firstName="John" lastName="Doe") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The use of \`{{with}}\` has been deprecated. Please see the deprecation guide at https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax.",
              "rule": "no-with",
              "severity": 2,
              "source": "{{#with (hash firstName=\\"John\\" lastName=\\"Doe\\") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}",
            },
          ]
        `);
      },
    },
  ],
});
