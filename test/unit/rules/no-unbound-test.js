'use strict';

const { message } = require('../../../lib/rules/no-unbound');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-unbound',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{unbound foo}}',

      result: {
        message,
        source: '{{unbound foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{my-thing foo=(unbound foo)}}',

      result: {
        message,
        source: '(unbound foo)',
        line: 1,
        column: 15,
      },
    },
  ],
});
