'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-restricted-invocations',

  config: [
    'foo',
    'bar',
    'nested-scope/foo-bar',
    {
      names: ['deprecated-component'],
      message: 'This component is deprecated; use component ABC instead.',
    },
  ],

  good: [
    '{{baz}}',
    '{{baz foo=bar}}',
    '{{baz foo=(baz)}}',
    '{{#baz}}{{/baz}}',
    '{{#baz foo=bar}}{{/baz}}',
    '{{#baz foo=(baz)}}{{/baz}}',

    // Component helper:
    '{{component}}',
    '{{component "baz"}}',
    '{{component "baz" foo=bar}}',
    '{{component "baz" foo=(baz)}}',
    '{{#component "baz"}}{{/component}}',
    '{{#component "baz" foo=bar}}{{/component}}',
    '{{#component "baz" foo=(baz)}}{{/component}}',
    '{{yield (component "baz")}}',
    '{{yield (component "baz" foo=bar)}}',
    '{{yield (component "baz" foo=(baz))}}',

    '{{yield (baz (baz (baz) bar))}}',
    '{{yield (baz (baz (baz) (baz)))}}',
    '{{yield (baz (baz (baz) foo=(baz)))}}',
    '{{#baz as |foo|}}{{foo}}{{/baz}}',
    '{{#with (component "blah") as |Foo|}} <Foo /> {{/with}}',
    '{{other/foo-bar}}',
    '{{nested-scope/other}}',

    // Angle bracket:
    '<Random/>',
    '<HelloWorld/>',
    '<NestedScope::Random/>',
  ],

  bad: [
    {
      template: '{{foo}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<Foo />',

      result: {
        message: "Cannot use disallowed helper or component '<Foo />'",
        source: '<Foo />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{foo foo=bar}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{foo foo=bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{foo foo=(baz)}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{foo foo=(baz)}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#foo}}{{/foo}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{#foo}}{{/foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#foo foo=bar}}{{/foo}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{#foo foo=bar}}{{/foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#foo foo=(baz)}}{{/foo}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{#foo foo=(baz)}}{{/foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "foo"}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{component "foo"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "foo" foo=bar}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{component "foo" foo=bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "foo" foo=(baz)}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{component "foo" foo=(baz)}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#component "foo"}}{{/component}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{#component "foo"}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#component "foo" foo=bar}}{{/component}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{#component "foo" foo=bar}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#component "foo" foo=(baz)}}{{/component}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '{{#component "foo" foo=(baz)}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{yield (component "foo")}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(component "foo")',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (component "foo" foo=bar)}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(component "foo" foo=bar)',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (component "foo" foo=(baz))}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(component "foo" foo=(baz))',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (baz (foo (baz) bar))}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(foo (baz) bar)',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{yield (baz (baz (baz) (foo)))}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(foo)',
        line: 1,
        column: 24,
      },
    },
    {
      template: '{{yield (baz (baz (baz) foo=(foo)))}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(foo)',
        line: 1,
        column: 28,
      },
    },
    {
      template: '{{#baz as |bar|}}{{bar foo=(foo)}}{{/baz}}',

      result: {
        message: "Cannot use disallowed helper or component '{{foo}}'",
        source: '(foo)',
        line: 1,
        column: 27,
      },
    },
    {
      template: '{{nested-scope/foo-bar}}',

      result: {
        message: "Cannot use disallowed helper or component '{{nested-scope/foo-bar}}'",
        source: '{{nested-scope/foo-bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<NestedScope::FooBar/>',

      result: {
        message: "Cannot use disallowed helper or component '<NestedScope::FooBar />'",
        source: '<NestedScope::FooBar/>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{deprecated-component}}',

      result: {
        message: 'This component is deprecated; use component ABC instead.',
        source: '{{deprecated-component}}',
        line: 1,
        column: 0,
      },
    },
  ],

  error: [
    {
      config: 'sometimes',
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `"sometimes"`',
      },
    },
    {
      config: true,
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `true`',
      },
    },
    {
      config: {},
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{}`',
      },
    },
    {
      config: [],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `[]`',
      },
    },
    {
      // Disallows non-string.
      config: [123],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `[123]`',
      },
    },
    {
      // Disallows empty string.
      config: [''],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `[""]`',
      },
    },
    {
      // Disallows incorrect naming format (disallows angle bracket invocation style).
      config: ['MyComponent'],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `["MyComponent"]`',
      },
    },
    {
      // Disallows incorrect naming format (disallows nested angle bracket invocation style).
      config: ['MyComponent'],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `["MyComponent"]`',
      },
    },
    {
      // Disallows incorrect naming format.
      config: ['Scope/MyComponent'],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `["Scope/MyComponent"]`',
      },
    },
    {
      // Disallows incorrect naming format.
      config: ['scope::my-component'],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `["scope::my-component"]`',
      },
    },
    {
      // Disallows empty object.
      config: [{}],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `[{}]`',
      },
    },
    {
      // Disallows object missing names array.
      config: [{ message: 'Custom error message.' }],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `[{"message":"Custom error message."}]`',
      },
    },
    {
      // Disallows object with empty names array.
      config: [{ names: [], message: 'Custom error message.' }],
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `[{"names":[],"message":"Custom error message."}]`',
      },
    },
  ],
});
