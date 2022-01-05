import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unknown-arguments-for-builtin-components',

  config: true,

  good: [
    '<Input @value="foo" />',
    '<Textarea @value="hello" />',
    '<LinkTo @route="info" @model={{this.model}} />',
    '<LinkTo @route="info" />',
    '<LinkTo @query={{hash foo=bar}} />',
  ],

  bad: [
    {
      template: '<Input @valuee={{this.content}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "\\"@valuee\\" is not a known argument for the <Input /> component. Did you mean \\"@value\\"?",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@valuee",
            },
          ]
        `);
      },
    },
    {
      template: '<Textarea @valuee={{this.content}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "\\"@valuee\\" is not a known argument for the <Textarea /> component. Did you mean \\"@value\\"?",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@valuee",
            },
          ]
        `);
      },
    },
    {
      template: '<LinkTo @route="foo" @valuee={{this.content}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "\\"@valuee\\" is not a known argument for the <LinkTo /> component. Did you mean \\"@query\\"?",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@valuee",
            },
          ]
        `);
      },
    },

    {
      template: '<LinkTo @route="foo" @madel={{this.content}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "\\"@madel\\" is not a known argument for the <LinkTo /> component. Did you mean \\"@model\\"?",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@madel",
            },
          ]
        `);
      },
    },

    {
      template: '<LinkTo @model={{this.model}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 1,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Arguments \\"@route\\" or \\"@query\\" is required for <LinkTo /> component.",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "LinkTo",
            },
          ]
        `);
      },
    },

    {
      template: '<LinkTo @route="info" @model={{this.model}} @models={{this.models}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "\\"@model\\" conflicts with \\"@models\\", only one should exists.",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@model",
            },
            Object {
              "column": 44,
              "endColumn": 67,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "\\"@models\\" conflicts with \\"@model\\", only one should exists.",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@models",
            },
          ]
        `);
      },
    },

    // LINK TO Deprecated Argument

    {
      template: '<LinkTo @route="info" @model={{this.model}} @tagName="button" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 44,
              "endColumn": 61,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Passing the \\"@tagName\\" argument to <LinkTo /> is deprecated.",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@tagName",
            },
          ]
        `);
      },
    },

    {
      template: '<LinkTo @route="info" @model={{this.model}} @elementId="superstar" />',
      fixedTemplate: '<LinkTo @route="info" @model={{this.model}} id="superstar" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 44,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@elementId\\" argument to <LinkTo /> is deprecated.
          Instead, please pass the attribute directly, i.e. \\"<LinkTo id={{...}} />\\" instead of \\"<LinkTo @elementId={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@elementId",
            },
          ]
        `);
      },
    },

    // LINK TO Deprecated Event

    {
      template: '<LinkTo @route="info" @model={{this.model}} @doubleClick={{action this.click}} />',
      fixedTemplate:
        '<LinkTo @route="info" @model={{this.model}} {{on "dblclick" (action this.click)}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 44,
              "endColumn": 78,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@doubleClick\\" argument to <LinkTo /> is deprecated.
          Instead, please use the {{on}} modifier, i.e. \\"<LinkTo {{on \\"dblclick\\" ...}} />\\" instead of \\"<LinkTo @doubleClick={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@doubleClick",
            },
          ]
        `);
      },
    },

    // Input Deprecated Argument

    {
      template: '<Input @value="1" @bubbles={{false}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 18,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Passing the \\"@bubbles\\" argument to <Input /> is deprecated.",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@bubbles",
            },
          ]
        `);
      },
    },

    {
      template: '<Input @value="1" @elementId="42" @disabled="disabled" />',
      fixedTemplate: '<Input @value="1" id="42" disabled="disabled" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 18,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@elementId\\" argument to <Input /> is deprecated.
          Instead, please pass the attribute directly, i.e. \\"<Input id={{...}} />\\" instead of \\"<Input @elementId={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@elementId",
            },
            Object {
              "column": 34,
              "endColumn": 54,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@disabled\\" argument to <Input /> is deprecated.
          Instead, please pass the attribute directly, i.e. \\"<Input disabled={{...}} />\\" instead of \\"<Input @disabled={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@disabled",
            },
          ]
        `);
      },
    },

    // Input Deprecated Event

    {
      template: '<Input @value="1" @key-up={{ths.onKeyUp}} />',
      fixedTemplate: '<Input @value="1" {{on "keyup" ths.onKeyUp}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 18,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@key-up\\" argument to <Input /> is deprecated.
          Instead, please use the {{on}} modifier, i.e. \\"<Input {{on \\"keyup\\" ...}} />\\" instead of \\"<Input @key-up={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@key-up",
            },
          ]
        `);
      },
    },

    // Textarea Deprecated Argument
    {
      template: '<Textarea @value="1" @bubbles={{false}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Passing the \\"@bubbles\\" argument to <Textarea /> is deprecated.",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@bubbles",
            },
          ]
        `);
      },
    },

    {
      template: '<Textarea @value="1" @elementId="42" />',
      fixedTemplate: '<Textarea @value="1" id="42" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@elementId\\" argument to <Textarea /> is deprecated.
          Instead, please pass the attribute directly, i.e. \\"<Textarea id={{...}} />\\" instead of \\"<Textarea @elementId={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@elementId",
            },
          ]
        `);
      },
    },
    // Textarea Deprecated Event

    {
      template: '<Textarea @value="1" @key-up={{ths.onKeyUp}} />',
      fixedTemplate: '<Textarea @value="1" {{on "keyup" ths.onKeyUp}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \\"@key-up\\" argument to <Textarea /> is deprecated.
          Instead, please use the {{on}} modifier, i.e. \\"<Textarea {{on \\"keyup\\" ...}} />\\" instead of \\"<Textarea @key-up={{...}} />\\".",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@key-up",
            },
          ]
        `);
      },
    },

    // LinkTo unknown argument

    {
      template:
        ' <LinkTo class="auk-search-results-list__item" @route={{@route}} @models={{this.models}} @random="test" @query={{@query}} ...attributes >Hello</LinkTo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 89,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "\\"@random\\" is not a known argument for the <LinkTo /> component. Did you mean \\"@dragOver\\"?",
              "rule": "no-unknown-arguments-for-builtin-components",
              "severity": 2,
              "source": "@random",
            },
          ]
        `);
      },
    },
  ],
});
