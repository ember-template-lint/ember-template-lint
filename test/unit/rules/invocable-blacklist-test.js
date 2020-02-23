'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'invocable-blacklist',

  config: ['foo', 'bar'],

  good: [
    '{{baz}}',
    '{{baz foo=bar}}',
    '{{baz foo=(baz)}}',
    '{{#baz}}{{/baz}}',
    '{{#baz foo=bar}}{{/baz}}',
    '{{#baz foo=(baz)}}{{/baz}}',
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
  ],

  bad: [
    {
      template: '{{foo}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<Foo />',

      result: {
        message: "Cannot use blacklisted helper or component '<Foo />'",
        source: '<Foo />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{foo foo=bar}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{foo foo=bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{foo foo=(baz)}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{foo foo=(baz)}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#foo}}{{/foo}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{#foo}}{{/foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#foo foo=bar}}{{/foo}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{#foo foo=bar}}{{/foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#foo foo=(baz)}}{{/foo}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{#foo foo=(baz)}}{{/foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "foo"}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{component "foo"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "foo" foo=bar}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{component "foo" foo=bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "foo" foo=(baz)}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{component "foo" foo=(baz)}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#component "foo"}}{{/component}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{#component "foo"}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#component "foo" foo=bar}}{{/component}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{#component "foo" foo=bar}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#component "foo" foo=(baz)}}{{/component}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '{{#component "foo" foo=(baz)}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{yield (component "foo")}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(component "foo")',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (component "foo" foo=bar)}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(component "foo" foo=bar)',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (component "foo" foo=(baz))}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(component "foo" foo=(baz))',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (baz (foo (baz) bar))}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(foo (baz) bar)',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{yield (baz (baz (baz) (foo)))}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(foo)',
        line: 1,
        column: 24,
      },
    },
    {
      template: '{{yield (baz (baz (baz) foo=(foo)))}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(foo)',
        line: 1,
        column: 28,
      },
    },
    {
      template: '{{#baz as |bar|}}{{bar foo=(foo)}}{{/baz}}',

      result: {
        message: "Cannot use blacklisted helper or component '{{foo}}'",
        source: '(foo)',
        line: 1,
        column: 27,
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
  ],
});
