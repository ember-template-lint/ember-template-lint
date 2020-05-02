'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/no-nested-landmark');

const { createErrorMessage } = rule;

generateRuleTests({
  name: 'no-nested-landmark',

  config: true,

  good: ['<div><main></main></div>'],

  bad: [
    {
      template: '<main><main></main></main>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 6,
        source: '<main></main>',
      },
    },
    {
      template: '<div role="main"><main></main></div>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 17,
        source: '<main></main>',
      },
    },
    {
      template: '<main><div role="main"></div></main>',
      result: {
        message: createErrorMessage('div'),
        line: 1,
        column: 6,
        source: '<div role="main"></div>',
      },
    },
  ],
});
