'use strict';

const { getErrorMessage } = require('../../../lib/rules/require-has-block-helper');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-has-block-helper',

  config: true,

  good: [
    '{{has-block}}',
    '{{has-block-params}}',
    '{{something-else}}',
    '{{component test=(if (has-block) "true")}}',
    '{{component test=(if (has-block-params) "true")}}',
    '<SomeComponent someProp={{has-block}}',
    '<SomeComponent someProp={{has-block-params}}',
    '{{#if (has-block)}}{{/if}}',
    '{{#if (has-block-params)}}{{/if}}',
  ],

  bad: [
    {
      template: '{{hasBlock}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 2,
        source: 'hasBlock',
      },
    },
    {
      template: '{{hasBlockParams}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 2,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{if hasBlock "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 5,
        source: 'hasBlock',
      },
    },
    {
      template: '{{if hasBlockParams "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 5,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{if (hasBlock) "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 6,
        source: 'hasBlock',
      },
    },
    {
      template: '{{if (hasBlockParams) "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 6,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{if (hasBlock "inverse") "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 6,
        source: 'hasBlock',
      },
    },
    {
      template: '{{if (hasBlockParams "inverse") "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 6,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{component test=(if hasBlock "true")}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 21,
        source: 'hasBlock',
      },
    },
    {
      template: '{{component test=(if hasBlockParams "true")}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 21,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{#if hasBlock}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 6,
        source: 'hasBlock',
      },
    },
    {
      template: '{{#if hasBlockParams}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 6,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{#if (hasBlock)}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 7,
        source: 'hasBlock',
      },
    },
    {
      template: '{{#if (hasBlockParams)}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 7,
        source: 'hasBlockParams',
      },
    },
    {
      template: '{{#if (hasBlock "inverse")}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 7,
        source: 'hasBlock',
      },
    },
    {
      template: '{{#if (hasBlockParams "inverse")}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 7,
        source: 'hasBlockParams',
      },
    },
    {
      template: '<button name={{hasBlock}}></button>',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 15,
        source: 'hasBlock',
      },
    },
    {
      template: '<button name={{hasBlockParams}}></button>',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 15,
        source: 'hasBlockParams',
      },
    },
    {
      template: '<button name={{hasBlock "inverse"}}></button>',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 15,
        source: 'hasBlock',
      },
    },
    {
      template: '<button name={{hasBlockParams "inverse"}}></button>',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 15,
        source: 'hasBlockParams',
      },
    },
  ],
});
