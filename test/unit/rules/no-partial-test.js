'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-partial').message;

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
