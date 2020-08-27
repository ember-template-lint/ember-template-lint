'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-yield-only');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-yield-only',

  config: true,

  good: [
    '{{yield (hash someProp=someValue)}}',
    '{{field}}',
    '{{#yield}}{{/yield}}',
    '<Yield/>',
    '<yield/>',
  ],

  bad: [
    {
      template: '{{yield}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{yield}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '     {{yield}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{yield}}',
        line: 1,
        column: 5,
      },
    },
    {
      template: '\n  {{yield}}\n     ',

      result: {
        message: ERROR_MESSAGE,
        source: '{{yield}}',
        line: 2,
        column: 2,
      },
    },
  ],
});
