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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '<Foo />'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "<Foo />",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo foo=bar}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{foo foo=bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo foo=(baz)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{foo foo=(baz)}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo}}{{/foo}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{#foo}}{{/foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo foo=bar}}{{/foo}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{#foo foo=bar}}{{/foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo foo=(baz)}}{{/foo}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{#foo foo=(baz)}}{{/foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{component "foo"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{component \\"foo\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{component "foo" foo=bar}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{component \\"foo\\" foo=bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{component "foo" foo=(baz)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{component \\"foo\\" foo=(baz)}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#component "foo"}}{{/component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{#component \\"foo\\"}}{{/component}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#component "foo" foo=bar}}{{/component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{#component \\"foo\\" foo=bar}}{{/component}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#component "foo" foo=(baz)}}{{/component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{#component \\"foo\\" foo=(baz)}}{{/component}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (component "foo")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(component \\"foo\\")",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (component "foo" foo=bar)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(component \\"foo\\" foo=bar)",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (component "foo" foo=(baz))}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(component \\"foo\\" foo=(baz))",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (baz (foo (baz) bar))}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(foo (baz) bar)",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (baz (baz (baz) (foo)))}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 24,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(foo)",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (baz (baz (baz) foo=(foo)))}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 28,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(foo)",
            },
          ]
        `);
      },
    },
    {
      template: '{{#baz as |bar|}}{{bar foo=(foo)}}{{/baz}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 27,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{foo}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "(foo)",
            },
          ]
        `);
      },
    },
    {
      template: '{{nested-scope/foo-bar}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '{{nested-scope/foo-bar}}'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{nested-scope/foo-bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '<NestedScope::FooBar/>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Cannot use disallowed helper or component '<NestedScope::FooBar />'",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "<NestedScope::FooBar/>",
            },
          ]
        `);
      },
    },
    {
      template: '{{deprecated-component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "This component is deprecated; use component ABC instead.",
              "rule": "no-restricted-invocations",
              "severity": 2,
              "source": "{{deprecated-component}}",
            },
          ]
        `);
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
