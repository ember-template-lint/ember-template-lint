'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-unbound').message;

generateRuleTests({
  name: 'no-unbound',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{unbound foo}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '{{unbound foo}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{my-thing foo=(unbound foo)}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '(unbound foo)',
        line: 1,
        column: 15,
      },
    },
  ],
});
