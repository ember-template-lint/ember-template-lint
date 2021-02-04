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
      fixedTemplate: '{{has-block}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 2,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{hasBlockParams}}',
      fixedTemplate: '{{has-block-params}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 2,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{if hasBlock "true" "false"}}',
      fixedTemplate: '{{if (has-block) "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 5,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{if hasBlockParams "true" "false"}}',
      fixedTemplate: '{{if (has-block-params) "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 5,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{if (hasBlock) "true" "false"}}',
      fixedTemplate: '{{if (has-block) "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 6,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{if (hasBlockParams) "true" "false"}}',
      fixedTemplate: '{{if (has-block-params) "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 6,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{if (hasBlock "inverse") "true" "false"}}',
      fixedTemplate: '{{if (has-block "inverse") "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 6,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{if (hasBlockParams "inverse") "true" "false"}}',
      fixedTemplate: '{{if (has-block-params "inverse") "true" "false"}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 6,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{component test=(if hasBlock "true")}}',
      fixedTemplate: '{{component test=(if (has-block) "true")}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 21,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{component test=(if hasBlockParams "true")}}',
      fixedTemplate: '{{component test=(if (has-block-params) "true")}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 21,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{#if hasBlock}}{{/if}}',
      fixedTemplate: '{{#if (has-block)}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 6,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{#if hasBlockParams}}{{/if}}',
      fixedTemplate: '{{#if (has-block-params)}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 6,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{#if (hasBlock)}}{{/if}}',
      fixedTemplate: '{{#if (has-block)}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 7,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{#if (hasBlockParams)}}{{/if}}',
      fixedTemplate: '{{#if (has-block-params)}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 7,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '{{#if (hasBlock "inverse")}}{{/if}}',
      fixedTemplate: '{{#if (has-block "inverse")}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 7,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '{{#if (hasBlockParams "inverse")}}{{/if}}',
      fixedTemplate: '{{#if (has-block-params "inverse")}}{{/if}}',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 7,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '<button name={{hasBlock}}></button>',
      fixedTemplate: '<button name={{has-block}}></button>',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 15,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '<button name={{hasBlockParams}}></button>',
      fixedTemplate: '<button name={{has-block-params}}></button>',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 15,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
    {
      template: '<button name={{hasBlock "inverse"}}></button>',
      fixedTemplate: '<button name={{has-block "inverse"}}></button>',
      result: {
        message: getErrorMessage('hasBlock'),
        line: 1,
        column: 15,
        source: 'hasBlock',
        isFixable: true,
      },
    },
    {
      template: '<button name={{hasBlockParams "inverse"}}></button>',
      fixedTemplate: '<button name={{has-block-params "inverse"}}></button>',
      result: {
        message: getErrorMessage('hasBlockParams'),
        line: 1,
        column: 15,
        source: 'hasBlockParams',
        isFixable: true,
      },
    },
  ],
});
