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
    '{{MyComponent a="2" b="1"}}',
    {
      config: {
        alphabetize: false,
      },
      template: '{{MyComponent b="2" a="1"}}',
    },
  ],

  bad: [
    {
      config: {
        alphabetize: true,
      },
      template: '{{MyComponent b="2" a="1"}}',
      result: {
        message: 'Attribute a="1" is not alphabetized',
        source: 'a="1"',
        line: 1,
        column: 20,
      },
    },
    {
      template: '<div ...attributes @a="1"></div>',
      result: {
        message: 'Argument @a="1" must go before attributes, modifiers and splattributes',
        source: '@a="1"',
        line: 1,
        column: 19,
      },
    },
    {
      template: '<div contenteditable @a="1"></div>',
      result: {
        message: 'Argument @a="1" must go before attributes, modifiers and splattributes',
        source: '@a="1"',
        line: 1,
        column: 21,
      },
    },
    {
      template: '<div {{did-render this.someAction}} @a="1"></div>',
      result: {
        message: 'Argument @a="1" must go before attributes, modifiers and splattributes',
        source: '@a="1"',
        line: 1,
        column: 36,
      },
    },
    {
      template: '<div ...attributes {{did-render this.someAction}}></div>',
      result: {
        message: 'Splattribute ...attributes must go after modifiers',
        source: '...attributes',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div {{did-render this.someAction}} aria-label="button"></div>',
      result: {
        message: 'Modifier {{did-render this.someAction}} must go after attributes',
        source: '{{did-render this.someAction}}',
        line: 1,
        column: 5,
      },
    },
    {
      config: {
        alphabetize: false,
      },
      template:
        '<MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
      result: {
        message:
          'Argument @change={{this.foo}} must go before attributes, modifiers and splattributes',
        source: '@change={{this.foo}}',
        line: 1,
        column: 38,
      },
    },
    {
      config: {
        attributeOrder: ['attributes', 'arguments', 'modifiers', 'splattributes'],
      },
      template: '<div @foo="1" {{did-render this.ok}} ...attributes aria-label="foo"></div>',
      result: {
        message: 'Attribute aria-label="foo" must go before arguments, modifiers and splattributes',
        source: 'aria-label="foo"',
        line: 1,
        column: 51,
      },
    },
    {
      config: {
        alphabetize: true,
      },
      template:
        '<div @foo="1" {{did-update this.notok}} {{did-render this.ok}} ...attributes aria-label="foo"></div>',
      result: {
        message: 'Modifier {{did-render this.ok}} is not alphabetized',
        source: '{{did-render this.ok}}',
        line: 1,
        column: 40,
      },
    },
    {
      config: {
        alphabetize: true,
      },
      template: '{{MyComponent b="2" a="1"}}',
      result: {
        message: 'Attribute a="1" is not alphabetized',
        source: 'a="1"',
        line: 1,
        column: 20,
      },
    },
  ],
});
