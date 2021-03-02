'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-yield-to-default');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-yield-to-default',

  config: true,

  good: [
    '{{yield}}',
    '{{yield to="title"}}',
    '{{has-block}}',
    '{{has-block "title"}}',
    '{{has-block-params}}',
    '{{has-block-params "title"}}',
    '{{hasBlock}}',
    '{{hasBlock "title"}}',
    '{{hasBlockParams}}',
    '{{hasBlockParams "title"}}',
  ],

  bad: [
    {
      template: '{{yield to="default"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 8,
        source: 'to="default"',
      },
    },
    {
      template: '{{has-block "default"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 12,
        source: '"default"',
      },
    },
    {
      template: '{{has-block-params "default"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 19,
        source: '"default"',
      },
    },
    {
      template: '{{hasBlock "default"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 11,
        source: '"default"',
      },
    },
    {
      template: '{{hasBlockParams "default"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 17,
        source: '"default"',
      },
    },
    {
      template: '{{if (has-block "default")}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 16,
        source: '"default"',
      },
    },
    {
      template: '{{#if (has-block "default")}}{{/if}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 17,
        source: '"default"',
      },
    },
    {
      template: '{{if (has-block-params "default")}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 23,
        source: '"default"',
      },
    },
    {
      template: '{{#if (has-block-params "default")}}{{/if}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 24,
        source: '"default"',
      },
    },
    {
      template: '{{if (hasBlock "default")}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 15,
        source: '"default"',
      },
    },
    {
      template: '{{#if (hasBlock "default")}}{{/if}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 16,
        source: '"default"',
      },
    },
    {
      template: '{{if (hasBlockParams "default")}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 21,
        source: '"default"',
      },
    },
    {
      template: '{{#if (hasBlockParams "default")}}{{/if}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 22,
        source: '"default"',
      },
    },
  ],
});
