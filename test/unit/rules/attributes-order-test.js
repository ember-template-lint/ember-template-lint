import { createAttributesOrderErrorMessage } from '../../../lib/rules/attributes-order.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'attributes-order',

  config: true,

  good: [
    '<div @foo="1" aria-label="foo" {{did-render this.ok}} ...attributes bar="baz"></div>',
    '<div @foo="1" aria-label="foo"></div>',
    '<div @foo="1" ...attributes></div>',
    '<div @foo="1" {{did-render this.ok}}></div>',
    '<div @foo="1" bar="baz"></div>',
    '<div bar="baz" {{did-render this.ok}} ...attributes label="foo"></div>',
    '<div aria-label="foo" bar="baz"></div>',
    '<div bar="baz" ...attributes></div>',
    '<div bar="baz" {{did-render this.ok}}></div>',
    '<div {{did-render this.oks}} ...attributes aria-label="foo"></div>',
    '<div {{did-render this.ok}} ...attributes></div>',
    '<div ...attributes aria-label="foo"></div>',
    '<div aria-label="foo"></div>',
    '<MyComponent @change={{this.foo}} @value="5" data-test-foo local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
    '{{MyComponent something another a="1" b="2"}}',
    '{{MyComponent a="2" b="1"}}',
    {
      config: {
        alphabetize: false,
      },
      template: '{{MyComponent b="2" a="1"}}',
    },
    '<MyComponent @bar="2" @z="1" bar="2"></MyComponent>',
  ],

  bad: [
    {
      template: '{{MyComponent something another b="1" a="2"}}',
      fixedTemplate: '{{MyComponent something another a="2" b="1"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 38,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute a=\\"2\\" is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "a=\\"2\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent @b="1" @a="2"></MyComponent>',
      fixedTemplate: '<MyComponent @a="2" @b="1"></MyComponent>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @a=\\"2\\" is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "@a=\\"2\\"",
            },
          ]
        `);
      },
    },
    {
      template:
        '<MyComponent {{did-update (fn this.click @a) @b}} {{did-insert this.click}}></MyComponent>',
      fixedTemplate:
        '<MyComponent {{did-insert this.click}} {{did-update (fn this.click @a) @b}}></MyComponent>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 50,
              "endColumn": 75,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-insert this.click}} is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "{{did-insert this.click}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{MyComponent b="2" a="1"}}',
      fixedTemplate: '{{MyComponent a="1" b="2"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute a=\\"1\\" is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div ...attributes @a="1"></div>',
      fixedTemplate: '<div @a="1" ...attributes></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @a=\\"1\\" must go before attributes, modifiers and splattributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "@a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div contenteditable @a="1"></div>',
      fixedTemplate: '<div @a="1" contenteditable></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @a=\\"1\\" must go before attributes, modifiers and splattributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "@a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div {{did-render this.someAction}} @a="1"></div>',
      fixedTemplate: '<div @a="1" {{did-render this.someAction}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 36,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @a=\\"1\\" must go before attributes, modifiers and splattributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "@a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div ...attributes {{did-render this.someAction}}></div>',
      fixedTemplate: '<div {{did-render this.someAction}} ...attributes></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Splattribute ...attributes must go after modifiers",
              "rule": "attributes-order",
              "severity": 2,
              "source": "...attributes",
            },
          ]
        `);
      },
    },
    {
      template: '<div {{did-render this.someAction}} aria-label="button"></div>',
      fixedTemplate: '<div aria-label="button" {{did-render this.someAction}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-render this.someAction}} must go after attributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "{{did-render this.someAction}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        alphabetize: false,
      },
      template:
        '<MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
      fixedTemplate:
        '<MyComponent @value="5" @change={{this.foo}} data-test-foo local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 38,
              "endColumn": 58,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @change={{this.foo}} must go before attributes, modifiers and splattributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "@change={{this.foo}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        attributeOrder: ['attributes'],
      },
      template: '{{my-component one two b=1 a=2}}',
      fixedTemplate: '{{my-component one two a=2 b=1}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute a=2 is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "a=2",
            },
          ]
        `);
      },
    },
    {
      config: {
        attributeOrder: ['attributes', 'arguments', 'modifiers', 'splattributes'],
      },
      template: '<div @foo="1" {{did-render this.ok}} ...attributes aria-label="foo"></div>',
      fixedTemplate: '<div aria-label="foo" @foo="1" {{did-render this.ok}} ...attributes></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 51,
              "endColumn": 67,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute aria-label=\\"foo\\" must go before arguments, modifiers and splattributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "aria-label=\\"foo\\"",
            },
          ]
        `);
      },
    },
    {
      config: {
        alphabetize: true,
      },
      template:
        '<div {{did-update this.notok}} {{did-render this.ok}} ...attributes aria-label="foo" @foo="1"></div>',
      fixedTemplate:
        '<div @foo="1" aria-label="foo" {{did-render this.ok}} {{did-update this.notok}} ...attributes></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 85,
              "endColumn": 93,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @foo=\\"1\\" must go before attributes, modifiers and splattributes",
              "rule": "attributes-order",
              "severity": 2,
              "source": "@foo=\\"1\\"",
            },
            {
              "column": 31,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-render this.ok}} is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "{{did-render this.ok}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        alphabetize: true,
      },
      template: '{{MyComponent b="2" a="1"}}',
      fixedTemplate: '{{MyComponent a="1" b="2"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute a=\\"1\\" is not alphabetized",
              "rule": "attributes-order",
              "severity": 2,
              "source": "a=\\"1\\"",
            },
          ]
        `);
      },
    },
  ],
  error: [
    {
      config: null,
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage(null),
      },
    },
    {
      config: 'true',
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage('true'),
      },
    },
    {
      config: {
        attributeOrder: ['arguments', 'NOT_AN_OPTION'],
      },
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage({
          attributeOrder: ['arguments', 'NOT_AN_OPTION'],
        }),
      },
    },
    {
      config: { invalidOption: true },
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage({ invalidOption: true }),
      },
    },
    {
      config: { alphabetize: 'true' },
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage({ alphabetize: 'true' }),
      },
    },
  ],
});
