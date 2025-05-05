import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-only-default-slot',

  config: true,

  good: [
    `<MyComponent>
      Hello!
    </MyComponent>`,
    `<MyComponent>
      <:header>header</:header>
      <:footer>footer</:footer>
    </MyComponent>`,
    `<MyComponent>
      <:default>header</:default>
      <:footer>footer</:footer>
    </MyComponent>`,
    `<MyComponent>
      <:footer>footer</:footer>
    </MyComponent>`,
  ],

  bad: [
    {
      template: '<MyComponent><:default>what</:default></MyComponent>',
      fixedTemplate: '<MyComponent>what</MyComponent>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 13,
     "endColumn": 38,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "Only default slot used — prefer direct block content without <:default> for clarity and simplicity.",
     "rule": "no-only-default-slot",
     "severity": 2,
     "source": "<:default>what</:default>",
   },
 ]
`);
      },
    },
    {
      template: '<MyComponent><:default></:default></MyComponent>',
      fixedTemplate: '<MyComponent></MyComponent>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 13,
     "endColumn": 34,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "Only default slot used — prefer direct block content without <:default> for clarity and simplicity.",
     "rule": "no-only-default-slot",
     "severity": 2,
     "source": "<:default></:default>",
   },
 ]
`);
      },
    },
  ],
});
