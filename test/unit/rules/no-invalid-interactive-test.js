'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-interactive',

  config: true,

  good: [
    '<button {{action "foo"}}></button>',
    '<canvas {{on "mousedown"}}></canvas>',
    '<div role="button" {{action "foo"}}></div>',
    '<div randomProperty={{myValue}}></div>',
    '<li><button {{action "foo"}}></button></li>',
    '<form {{action "foo" on="submit"}}></form>',
    '<form onsubmit={{action "foo"}}></form>',
    '<form onchange={{action "foo"}}></form>',
    '<form {{action "foo" on="reset"}}></form>',
    '<form {{action "foo" on="change"}}></form>',
    '<form onreset={{action "foo"}}></form>',
    '<img onerror={{action "foo"}}>',
    '<img onload={{action "foo"}}>',
    '<InputSearch @onInput={{action "foo"}} />',
    '<InputSearch @onInput={{action "foo"}}></InputSearch>',
    '{{#with (hash bar=(component "foo")) as |foo|}}<foo.bar @onInput={{action "foo"}}></foo.bar>{{/with}}',
    '<form {{on "submit" this.send}}></form>',
    '<form {{on "reset" this.reset}}></form>',
    '<form {{on "change" this.change}}></form>',
    '<div {{on "scroll" this.handleScroll}}></div>',
    '<code {{on "copy" (action @onCopy)}}></code>',
    {
      config: { additionalInteractiveTags: ['div'] },
      template: '<div {{on "click" this.onClick}}></div>',
    },
    {
      config: { additionalInteractiveTags: ['div'] },
      template: '<div {{action "foo"}}></div>',
    },
    {
      config: { additionalInteractiveTags: ['div'] },
      template: '<div onclick={{action "foo"}}></div>',
    },
    {
      config: { additionalInteractiveTags: ['img'] },
      template: '<img onerror={{action "foo"}}>',
    },
    {
      config: { ignoredTags: ['div'] },
      template: '<div {{on "click" this.actionName}}>...</div>',
    },
    {
      config: { ignoredTags: ['div'] },
      template: '<div onclick={{action "foo"}}></div>',
    },
    '<img {{on "load" this.onLoad}} {{on "error" this.onError}}>',
  ],

  bad: [
    {
      template: '<div {{on "click" this.actionName}}>...</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div {{on \\"click\\" this.actionName}}>...</div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div {{action "foo"}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div {{action \\"foo\\"}}></div>",
            },
          ]
        `);
      },
    },

    {
      template: '<div onclick={{action "foo"}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div onclick={{action \\"foo\\"}}></div>",
            },
          ]
        `);
      },
    },

    {
      // This example is detected solely based on the DOM event attribute name.
      template: '<div onclick={{pipe-action "foo"}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div onclick={{pipe-action \\"foo\\"}}></div>",
            },
          ]
        `);
      },
    },

    {
      template: '<div onsubmit={{action "foo"}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div onsubmit={{action \\"foo\\"}}></div>",
            },
          ]
        `);
      },
    },

    {
      // Any usage of the `action` helper will be caught, regardless of the attribute name.
      template: '<div randomAttribute={{action "foo"}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div randomAttribute={{action \\"foo\\"}}></div>",
            },
          ]
        `);
      },
    },

    {
      template: '<form {{action "foo" on="click"}}></form>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<form {{action \\"foo\\" on=\\"click\\"}}></form>",
            },
          ]
        `);
      },
    },

    {
      template: '<div {{action "foo" on="submit"}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Interaction added to non-interactive element",
              "rule": "no-invalid-interactive",
              "severity": 2,
              "source": "<div {{action \\"foo\\" on=\\"submit\\"}}></div>",
            },
          ]
        `);
      },
    },
  ],
});
