'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-action');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-action',

  config: true,

  good: [
    '{{#let (fn this.foo bar) as |action|}}<Component @baz={{action}} />{{/let}}',
    '<MyScope as |action|><Component @baz={{action}} /></MyScope>',
    '<button {{on "submit" @action}}>Click Me</button>',
    '<button {{on "submit" this.action}}>Click Me</button>',
    // check for scope.getLocalName working for primitives and locals #881
    '<PButton @naked={{42}} />',
    '<PButton @naked={{true}} />',
    '<PButton @naked={{undefined}} />',
    '<PButton @naked={{null}} />',
    '<PButton @naked={{this}} />',
    '<PButton @naked={{"action"}} />',
  ],

  bad: [
    {
      template: '<button onclick={{action "foo"}}></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 16,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`action\` as {{action ...}}. Instead, use the \`on\` modifier and \`fn\` helper.",
              "rule": "no-action",
              "severity": 2,
              "source": "{{action \\"foo\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button {{action "submit"}}>Submit</button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`action\` as <button {{action ...}} />. Instead, use the \`on\` modifier and \`fn\` helper.",
              "rule": "no-action",
              "severity": 2,
              "source": "{{action \\"submit\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<FooBar @baz={{action "submit"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`action\` as {{action ...}}. Instead, use the \`on\` modifier and \`fn\` helper.",
              "rule": "no-action",
              "severity": 2,
              "source": "{{action \\"submit\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (action "foo")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`action\` as (action ...). Instead, use the \`on\` modifier and \`fn\` helper.",
              "rule": "no-action",
              "severity": 2,
              "source": "(action \\"foo\\")",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (action this.foo)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`action\` as (action ...). Instead, use the \`on\` modifier and \`fn\` helper.",
              "rule": "no-action",
              "severity": 2,
              "source": "(action this.foo)",
            },
          ]
        `);
      },
    },
  ],
});
