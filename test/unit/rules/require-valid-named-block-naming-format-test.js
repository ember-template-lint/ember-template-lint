'use strict';

const {
  createErrorMessage,
  FORMAT,
} = require('../../../lib/rules/require-valid-named-block-naming-format');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-valid-named-block-naming-format',

  config: true,

  good: [
    // Default config.
    '{{yield}}',
    '{{yield to="fooBar"}}',

    '{{has-block}}',
    '{{has-block "fooBar"}}',

    '{{if (has-block)}}',
    '{{if (has-block "fooBar")}}',

    '{{has-block-params}}',
    '{{has-block-params "fooBar"}}',

    '{{if (has-block-params)}}',
    '{{if (has-block-params "fooBar")}}',

    // Explicit config: `camelCase`.
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{yield to="fooBar"}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block "fooBar"}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block "fooBar")}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block-params "fooBar"}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block-params "fooBar")}}',
    },

    // Explicit config: `kebab-case`.
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{yield to="foo-bar"}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block "foo-bar"}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block "foo-bar")}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block-params "foo-bar"}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block-params "foo-bar")}}',
    },
  ],

  bad: [
    // Default config.
    {
      template: '{{yield to="foo-bar"}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 8,
        source: 'to="foo-bar"',
      },
    },
    {
      template: '{{has-block "foo-bar"}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 12,
        source: '"foo-bar"',
      },
    },
    {
      template: '{{if (has-block "foo-bar")}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 16,
        source: '"foo-bar"',
      },
    },
    {
      template: '{{has-block-params "foo-bar"}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 19,
        source: '"foo-bar"',
      },
    },
    {
      template: '{{if (has-block-params "foo-bar")}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 23,
        source: '"foo-bar"',
      },
    },

    // Explicit config: `camelCase`.
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{yield to="foo-bar"}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 8,
        source: 'to="foo-bar"',
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block "foo-bar"}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 12,
        source: '"foo-bar"',
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block "foo-bar")}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 16,
        source: '"foo-bar"',
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block-params "foo-bar"}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 19,
        source: '"foo-bar"',
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block-params "foo-bar")}}',
      result: {
        message: createErrorMessage(FORMAT.CAMEL_CASE, 'foo-bar', 'fooBar'),
        line: 1,
        column: 23,
        source: '"foo-bar"',
      },
    },

    // Explicit config: `kebab-case`.
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{yield to="fooBar"}}',
      result: {
        message: createErrorMessage(FORMAT.KEBAB_CASE, 'fooBar', 'foo-bar'),
        line: 1,
        column: 8,
        source: 'to="fooBar"',
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block "fooBar"}}',
      result: {
        message: createErrorMessage(FORMAT.KEBAB_CASE, 'fooBar', 'foo-bar'),
        line: 1,
        column: 12,
        source: '"fooBar"',
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block "fooBar")}}',
      result: {
        message: createErrorMessage(FORMAT.KEBAB_CASE, 'fooBar', 'foo-bar'),
        line: 1,
        column: 16,
        source: '"fooBar"',
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block-params "fooBar"}}',
      result: {
        message: createErrorMessage(FORMAT.KEBAB_CASE, 'fooBar', 'foo-bar'),
        line: 1,
        column: 19,
        source: '"fooBar"',
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block-params "fooBar")}}',
      result: {
        message: createErrorMessage(FORMAT.KEBAB_CASE, 'fooBar', 'foo-bar'),
        line: 1,
        column: 23,
        source: '"fooBar"',
      },
    },
  ],
});
