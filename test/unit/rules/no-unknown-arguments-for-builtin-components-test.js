'use strict';

const {
  ERROR_MESSAGE,
  REQUIRED_MESSAGE,
  CONFLICT_MESSAGE,
} = require('../../../lib/rules/no-unknown-arguments-for-builtin-components');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
      results: [
        {
          message: CONFLICT_MESSAGE('@model', ['model', 'models']),
          line: 1,
          column: 22,
          source: '@model',
        },
        {
          message: CONFLICT_MESSAGE('@models', ['model', 'models']),
          line: 1,
          column: 44,
          source: '@models',
        },
      ],
    },

    // LINK TO Deprecated Argument

    {
      template: '<LinkTo @route="info" @model={{this.model}} @tagName="button" />',
      results: [
        {
          message: 'Passing the "@tagName" argument to <LinkTo /> is deprecated.',
          line: 1,
          column: 44,
          source: '@tagName',
          isFixable: false,
        },
      ],
    },

    {
      template: '<LinkTo @route="info" @model={{this.model}} @elementId="superstar" />',
      fixedTemplate: '<LinkTo @route="info" @model={{this.model}} id="superstar" />',
      results: [
        {
          message:
            'Passing the "@elementId" argument to <LinkTo /> is deprecated.\nInstead, please pass the attribute directly, i.e. "<LinkTo id={{...}} />" instead of "<LinkTo @elementId={{...}} />".',
          line: 1,
          column: 44,
          source: '@elementId',
          isFixable: true,
        },
      ],
    },

    // LINK TO Deprecated Event

    {
      template: '<LinkTo @route="info" @model={{this.model}} @doubleClick={{action this.click}} />',
      fixedTemplate:
        '<LinkTo @route="info" @model={{this.model}} {{on "dblclick" (action this.click)}} />',
      results: [
        {
          message:
            'Passing the "@doubleClick" argument to <LinkTo /> is deprecated.\nInstead, please use the {{on}} modifier, i.e. "<LinkTo {{on "dblclick" ...}} />" instead of "<LinkTo @doubleClick={{...}} />".',
          line: 1,
          column: 44,
          source: '@doubleClick',
          isFixable: true,
        },
      ],
    },

    // Input Deprecated Argument

    {
      template: '<Input @value="1" @bubbles={{false}} />',
      results: [
        {
          message: 'Passing the "@bubbles" argument to <Input /> is deprecated.',
          line: 1,
          column: 18,
          source: '@bubbles',
          isFixable: false,
        },
      ],
    },

    {
      template: '<Input @value="1" @elementId="42" @disabled="disabled" />',
      fixedTemplate: '<Input @value="1" id="42" disabled="disabled" />',
      results: [
        {
          message:
            'Passing the "@elementId" argument to <Input /> is deprecated.\nInstead, please pass the attribute directly, i.e. "<Input id={{...}} />" instead of "<Input @elementId={{...}} />".',
          line: 1,
          column: 18,
          source: '@elementId',
          isFixable: true,
        },
        {
          message:
            'Passing the "@disabled" argument to <Input /> is deprecated.\nInstead, please pass the attribute directly, i.e. "<Input disabled={{...}} />" instead of "<Input @disabled={{...}} />".',
          line: 1,
          column: 34,
          source: '@disabled',
          isFixable: true,
        },
      ],
    },

    // Input Deprecated Event

    {
      template: '<Input @value="1" @key-up={{ths.onKeyUp}} />',
      fixedTemplate: '<Input @value="1" {{on "keyup" ths.onKeyUp}} />',
      results: [
        {
          message:
            'Passing the "@key-up" argument to <Input /> is deprecated.\nInstead, please use the {{on}} modifier, i.e. "<Input {{on "keyup" ...}} />" instead of "<Input @key-up={{...}} />".',
          line: 1,
          column: 18,
          source: '@key-up',
          isFixable: true,
        },
      ],
    },

    // Textarea Deprecated Argument
    {
      template: '<Textarea @value="1" @bubbles={{false}} />',
      results: [
        {
          message: 'Passing the "@bubbles" argument to <Textarea /> is deprecated.',
          line: 1,
          column: 21,
          source: '@bubbles',
          isFixable: false,
        },
      ],
    },

    {
      template: '<Textarea @value="1" @elementId="42" />',
      fixedTemplate: '<Textarea @value="1" id="42" />',
      results: [
        {
          message:
            'Passing the "@elementId" argument to <Textarea /> is deprecated.\nInstead, please pass the attribute directly, i.e. "<Textarea id={{...}} />" instead of "<Textarea @elementId={{...}} />".',
          line: 1,
          column: 21,
          source: '@elementId',
          isFixable: true,
        },
      ],
    },
    // Textarea Deprecated Event

    {
      template: '<Textarea @value="1" @key-up={{ths.onKeyUp}} />',
      fixedTemplate: '<Textarea @value="1" {{on "keyup" ths.onKeyUp}} />',
      results: [
        {
          message:
            'Passing the "@key-up" argument to <Textarea /> is deprecated.\nInstead, please use the {{on}} modifier, i.e. "<Textarea {{on "keyup" ...}} />" instead of "<Textarea @key-up={{...}} />".',
          line: 1,
          column: 21,
          source: '@key-up',
          isFixable: true,
        },
      ],
    },

    // LinkTo unknown argument

    {
      template:
        ' <LinkTo class="auk-search-results-list__item" @route={{@route}} @models={{this.models}} @random="test" @query={{@query}} ...attributes >Hello</LinkTo>',
      results: [
        {
          message:
            '"@random" is not a known argument for the <LinkTo /> component. Did you mean "@dragOver"?',
          line: 1,
          column: 89,
          source: '@random',
          isFixable: false,
        },
      ],
    },
  ],
});
