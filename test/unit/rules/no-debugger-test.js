'use strict';

const { message } = require('../../../lib/rules/no-debugger');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-debugger',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{debugger}}',

      result: {
        message,
        source: '{{debugger}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{debugger}}',

      result: {
        message,
        source: '{{debugger}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#debugger}}Invalid!{{/debugger}}',

      result: {
        message,
        source: '{{#debugger}}Invalid!{{/debugger}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
