'use strict';

const { message } = require('../../../lib/rules/no-input-block');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-input-block',

  config: true,

  good: ['{{button}}', '{{#x-button}}{{/x-button}}', '{{input}}'],

  bad: [
    {
      template: '{{#input}}{{/input}}',

      result: {
        message,
        source: '{{#input}}{{/input}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
