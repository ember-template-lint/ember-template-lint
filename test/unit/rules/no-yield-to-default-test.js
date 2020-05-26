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
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{yield to="default"}}',
      },
    },
    {
      template: '{{has-block "default"}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{has-block "default"}}',
      },
    },
    {
      template: '{{has-block-params "default"}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{has-block-params "default"}}',
      },
    },
    {
      template: '{{hasBlock "default"}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{hasBlock "default"}}',
      },
    },
    {
      template: '{{hasBlockParams "default"}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{hasBlockParams "default"}}',
      },
    },
    {
      template: '{{if (has-block "default")}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '(has-block "default")',
      },
    },
    {
      template: '{{#if (has-block "default")}}{{/if}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 6,
        source: '(has-block "default")',
      },
    },
    {
      template: '{{if (has-block-params "default")}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '(has-block-params "default")',
      },
    },
    {
      template: '{{#if (has-block-params "default")}}{{/if}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 6,
        source: '(has-block-params "default")',
      },
    },
    {
      template: '{{if (hasBlock "default")}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '(hasBlock "default")',
      },
    },
    {
      template: '{{#if (hasBlock "default")}}{{/if}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 6,
        source: '(hasBlock "default")',
      },
    },
    {
      template: '{{if (hasBlockParams "default")}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '(hasBlockParams "default")',
      },
    },
    {
      template: '{{#if (hasBlockParams "default")}}{{/if}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 6,
        source: '(hasBlockParams "default")',
      },
    },
  ],
});
