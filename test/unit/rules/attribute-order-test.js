import { createAttributesOrderErrorMessage } from '../../../lib/rules/attribute-order.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'attribute-order',

  config: true,

  good: [
    '<MyComponent @a="1" {{on "change" this.click}} ...attributes />',
    '<MyComponent @name="1" bar="baz" {{did-render this.someAction}} ...attributes aria-role="button" />',
    '<MyComponent @name="1" aria-role="button" />',
    '<MyComponent @name="1" ...attributes />',
    '<MyComponent @name="1" {{did-render this.someAction}} />',
    '<MyComponent @name="1" bar="baz" />',
    '<div b="1" ...attributes aria-label="foo"></div>',
    '<div ...attributes {{did-render this.someAction}}></div>',
    '<div ...attributes @a="1"></div>',
    '<div bar="baz" {{did-render this.ok}} ...attributes label="foo"></div>',
    '<div ...attributes @a="1" b="2"></div>',
    '<div @a="1" ...attributes></div>',
    '<div @foo="1" aria-label="foo" {{did-render this.ok}} ...attributes bar="baz"></div>',
    '<div @foo="1" aria-label="foo"></div>',
    '<div @foo="1" ...attributes></div>',
    '<div @foo="1" {{did-render this.ok}}></div>',
    '<div @foo="1" bar="baz"></div>',
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
      template:
        '<div {{in-viewport onEnter=this.loadMore viewportSpy=true}} {{did-update this.loadMore this.activeTab}}></div>',
      fixedTemplate:
        '<div {{did-update this.loadMore this.activeTab}} {{in-viewport onEnter=this.loadMore viewportSpy=true}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 60,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-update this.loadMore this.activeTab}} is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "{{did-update this.loadMore this.activeTab}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div b="1" aria-label="foo"></div>',
      fixedTemplate: '<div aria-label="foo" b="1"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute aria-label=\\"foo\\" is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "aria-label=\\"foo\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent data-test-id="Hello" @name="World" />',
      fixedTemplate: '<MyComponent @name="World" data-test-id="Hello" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @name=\\"World\\" must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@name=\\"World\\"",
            },
            {
              "column": 13,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute data-test-id=\\"Hello\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "data-test-id=\\"Hello\\"",
            },
          ]
        `);
      },
    },
    {
      config: {
        order: ['attributes', 'arguments', 'modifiers'],
      },
      template: '<div @foo="1" {{did-render this.ok}} aria-label="foo"></div>',
      fixedTemplate: '<div aria-label="foo" @foo="1" {{did-render this.ok}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 37,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute aria-label=\\"foo\\" must go before arguments and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "aria-label=\\"foo\\"",
            },
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @foo=\\"1\\" must go after attributes",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@foo=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      config: {
        order: ['modifiers', 'attributes', 'arguments'],
      },
      template: '<div @foo="1" {{did-render this.ok}} aria-label="foo"></div>',
      fixedTemplate: '<div {{did-render this.ok}} aria-label="foo" @foo="1"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-render this.ok}} must go before attributes and arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "{{did-render this.ok}}",
            },
            {
              "column": 37,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute aria-label=\\"foo\\" must go after modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "aria-label=\\"foo\\"",
            },
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @foo=\\"1\\" must go after attributes",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@foo=\\"1\\"",
            },
          ]
        `);
      },
    },
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
              "rule": "attribute-order",
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
              "rule": "attribute-order",
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
              "rule": "attribute-order",
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
              "rule": "attribute-order",
              "severity": 2,
              "source": "a=\\"1\\"",
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
              "column": 36,
              "endColumn": 55,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute aria-label=\\"button\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "aria-label=\\"button\\"",
            },
            {
              "column": 5,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-render this.someAction}} must go after attributes",
              "rule": "attribute-order",
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
              "message": "Argument @change={{this.foo}} must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@change={{this.foo}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '<MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} as |sth|>content</MyComponent>',
      fixedTemplate:
        '<MyComponent @change={{this.foo}} @value="5" data-test-foo local-class="foo" {{on "click" this.foo}} as |sth|>content</MyComponent>',
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
              "message": "Argument @change={{this.foo}} is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@change={{this.foo}}",
            },
            {
              "column": 38,
              "endColumn": 58,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @change={{this.foo}} must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@change={{this.foo}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        order: ['attributes', 'arguments', 'modifiers'],
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
              "rule": "attribute-order",
              "severity": 2,
              "source": "a=2",
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
        '<div {{did-update this.notok}} {{did-render this.ok}} aria-label="foo" @foo="1"></div>',
      fixedTemplate:
        '<div @foo="1" aria-label="foo" {{did-render this.ok}} {{did-update this.notok}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 71,
              "endColumn": 79,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @foo=\\"1\\" must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@foo=\\"1\\"",
            },
            {
              "column": 54,
              "endColumn": 70,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute aria-label=\\"foo\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "aria-label=\\"foo\\"",
            },
            {
              "column": 31,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-render this.ok}} is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "{{did-render this.ok}}",
            },
            {
              "column": 31,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Modifier {{did-render this.ok}} must go after attributes",
              "rule": "attribute-order",
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
              "rule": "attribute-order",
              "severity": 2,
              "source": "a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template:
        '<Button @description="a" @block={{@b}} @dialogTitle="a" @dialogButton="b" @button="b" @alert="b" @alertDescription="d"></Button>',
      fixedTemplate:
        '<Button @alert="b" @alertDescription="d" @block={{@b}} @button="b" @description="a" @dialogButton="b" @dialogTitle="a"></Button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 25,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @block={{@b}} is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@block={{@b}}",
            },
          ]
        `);
      },
    },
    {
      template: `<MyComponent
        @c="2"
        @b="3"
      ></MyComponent>`,
      fixedTemplate: `<MyComponent @b="3" @c="2"></MyComponent>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 14,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Argument @b=\\"3\\" is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@b=\\"3\\"",
            },
          ]
        `);
      },
    },
    {
      template: `<!-- hi --> <MyComponent
        {{did-update this.ok}}
        a=1
        @c="2"
      ></MyComponent>`,
      fixedTemplate: `<!-- hi --> <MyComponent @c="2" a=1 {{did-update this.ok}}></MyComponent>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 14,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Argument @c=\\"2\\" must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@c=\\"2\\"",
            },
            {
              "column": 8,
              "endColumn": 11,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Attribute a=1 must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "a=1",
            },
            {
              "column": 8,
              "endColumn": 30,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Modifier {{did-update this.ok}} must go after attributes",
              "rule": "attribute-order",
              "severity": 2,
              "source": "{{did-update this.ok}}",
            },
          ]
        `);
      },
    },
    {
      template: `{{MyComponent
        c="2"
        b="3"
      }}`,
      fixedTemplate: `{{MyComponent
        b="3"
        c="2"
      }}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 13,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Attribute b=\\"3\\" is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "b=\\"3\\"",
            },
          ]
        `);
      },
    },
    {
      template: `<Shared::Modal b="2" a="1" @close={{action "closeModal"}} as |modal| {{did-insert this.ok}}>
        content
      </Shared::Modal>`,
      fixedTemplate: `<Shared::Modal @close={{action "closeModal"}} a="1" b="2" {{did-insert this.ok}} as |modal|>
        content
      </Shared::Modal>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @close={{action \\"closeModal\\"}} must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@close={{action \\"closeModal\\"}}",
            },
            {
              "column": 21,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute a=\\"1\\" is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "a=\\"1\\"",
            },
            {
              "column": 21,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute a=\\"1\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: `<Input
      @type="checkbox"
      @checked={{@title.isVisible}}
    />`,
      fixedTemplate: `<Input @checked={{@title.isVisible}} @type="checkbox" />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 35,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Argument @checked={{@title.isVisible}} is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@checked={{@title.isVisible}}",
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
              "message": "Argument @a=\\"1\\" must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@a=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo class="asd" @tagName="" />',
      fixedTemplate: '<Foo @tagName="" class="asd" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @tagName=\\"\\" must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@tagName=\\"\\"",
            },
            {
              "column": 5,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute class=\\"asd\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "class=\\"asd\\"",
            },
          ]
        `);
      },
    },
    {
      template: `<Foo
      {{!-- @glint-expect-error --}}
      id="op"
      {{!-- @second --}}
      @foo={{1}}
    />`,
      fixedTemplate: `<Foo {{!-- @second --}} @foo={{1}} {{!-- @glint-expect-error --}} id="op" />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 16,
              "endLine": 5,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 5,
              "message": "Argument @foo={{1}} must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@foo={{1}}",
            },
            {
              "column": 6,
              "endColumn": 13,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Attribute id=\\"op\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "id=\\"op\\"",
            },
          ]
        `);
      },
    },
    {
      template: `<Foo
        {{!-- @glint-expect-error --}}
        id="op"
        {{!-- double comment --}}
        {{!-- @second --}}
        @foo={{1}}
        {{!-- another comment --}}
        {{!-- second last --}}
        {{!-- trailing comment --}}
      />`,
      fixedTemplate: `<Foo {{!-- double comment --}} {{!-- @second --}} @foo={{1}} {{!-- @glint-expect-error --}} id="op" {{!-- another comment --}} {{!-- second last --}} {{!-- trailing comment --}} />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 18,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 6,
              "message": "Argument @foo={{1}} must go before attributes and modifiers",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@foo={{1}}",
            },
            {
              "column": 8,
              "endColumn": 15,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Attribute id=\\"op\\" must go after arguments",
              "rule": "attribute-order",
              "severity": 2,
              "source": "id=\\"op\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<Link @b="b" @a="a">Foo</Link>',
      fixedTemplate: '<Link @a="a" @b="b">Foo</Link>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Argument @a=\\"a\\" is not alphabetized",
              "rule": "attribute-order",
              "severity": 2,
              "source": "@a=\\"a\\"",
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
        order: ['arguments', 'NOT_AN_OPTION'],
      },
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage({
          order: ['arguments', 'NOT_AN_OPTION'],
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
    {
      config: {
        order: ['attributes'],
      },
      template: 'test',
      result: {
        fatal: true,
        message: createAttributesOrderErrorMessage({
          order: ['attributes'],
        }),
      },
    },
  ],
});
