'use strict';

const {
  ERROR_MESSAGE,
  REQUIRED_MESSAGE,
  CONFLICT_MESSAGE,
} = require('../../../lib/rules/no-unknown-arguments-for-builtin-components');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-unknown-arguments-for-builtin-components',

  config: true,

  good: [
    '<Input @value="foo" />',
    '<Textarea @value="hello" />',
    '<LinkTo @route="info" @model={{this.model}} />',
  ],

  bad: [
    {
      template: '<Input @valuee={{this.content}} />',
      result: {
        message: ERROR_MESSAGE('Input', '@valuee'),
        line: 1,
        column: 7,
        source: '@valuee',
      },
    },
    {
      template: '<Textarea @valuee={{this.content}} />',
      result: {
        message: ERROR_MESSAGE('Textarea', '@valuee'),
        line: 1,
        column: 10,
        source: '@valuee',
      },
    },
    {
      template: '<LinkTo @route="foo" @valuee={{this.content}} />',
      result: {
        message: ERROR_MESSAGE('LinkTo', '@valuee'),
        line: 1,
        column: 21,
        source: '@valuee',
      },
    },

    {
      template: '<LinkTo @route="foo" @madel={{this.content}} />',
      result: {
        message: '"@madel" is unknown argument for <LinkTo /> component. Did you mean "@model"?',
        line: 1,
        column: 21,
        source: '@madel',
      },
    },

    {
      template: '<LinkTo @model={{this.model}} />',
      result: {
        message: REQUIRED_MESSAGE('LinkTo', ['route']),
        line: 1,
        column: 1,
        source: 'LinkTo',
      },
    },

    {
      template: '<LinkTo @route="info" @model={{this.model}} @models={{this.models}} />',
      results: [
        {
          message: CONFLICT_MESSAGE('@model', ['model', 'models']),
          line: 1,
          column: 22,
          source: '@model',
        },
        {
          message: CONFLICT_MESSAGE('@models', ['model', 'models']),
          line: 1,
          column: 44,
          source: '@models',
        },
      ],
    },
  ],
});
