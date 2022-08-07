import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'element-attributes-order',

  config: true,

  good: [
    '<div @foo="1" bar="baz" {{did-render this.ok}} ...attributes aria-label="foo"></div>',
    '<div @foo="1" aria-label="foo"></div>',
    '<div @foo="1" ...attributes></div>',
    '<div @foo="1" {{did-render this.ok}}></div>',
    '<div @foo="1" bar="baz"></div>',
    '<div bar="baz" {{did-render this.ok}} ...attributes aria-label="foo"></div>',
    '<div bar="baz" aria-label="foo"></div>',
    '<div bar="baz" ...attributes></div>',
    '<div bar="baz" {{did-render this.ok}}></div>',
    '<div {{did-render this.oks}} ...attributes aria-label="foo"></div>',
    '<div {{did-render this.ok}} ...attributes></div>',
    '<div ...attributes aria-label="foo"></div>',
    '<div aria-label="foo"></div>',
    '<MyComponent @value="5" @change={{this.foo}} local-class="foo" data-test-foo {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
  ],

  bad: [
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
  ],
});
