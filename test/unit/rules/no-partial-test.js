'use strict';

const { message } = require('../../../lib/rules/no-partial');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-partial',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{partial "foo"}}',

      result: {
        message,
        source: '{{partial "foo"}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
