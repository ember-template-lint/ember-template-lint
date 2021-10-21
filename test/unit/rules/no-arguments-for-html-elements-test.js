'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-arguments-for-html-elements',

  config: true,

  good: [
    '<Input @name=1 />',
    '{{#let (component \'foo\') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}',
    '<@externalComponent />',
    `<MyComponent>
    <:slot @name="Header"></:slot>
  </MyComponent>`,
    '<@foo.bar @name="2" />',
    '<this.name @boo="bar"></this.name>',
    '<@foo @name="2" />',
    '<foo.some.name @name="1" />',
  ],

  bad: [
    {
      template: '<div @value="1"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Arguments (@value) should not be used on HTML elements (<div>).",
              "rule": "no-arguments-for-html-elements",
              "severity": 2,
              "source": "@value=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div @value></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Arguments (@value) should not be used on HTML elements (<div>).",
              "rule": "no-arguments-for-html-elements",
              "severity": 2,
              "source": "@value",
            },
          ]
        `);
      },
    },
    {
      template: '<img @src="12">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Arguments (@src) should not be used on HTML elements (<img>).",
              "rule": "no-arguments-for-html-elements",
              "severity": 2,
              "source": "@src=\\"12\\"",
            },
          ]
        `);
      },
    },
  ],
});
