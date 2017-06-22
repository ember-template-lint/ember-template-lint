'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/lint-no-debugger').message;

generateRuleTests({
  name: 'no-debugger',

  config: true,

  good: [
    '{{foo}}',
    '{{button}}'
  ],

  bad: [
    {
      template: '{{debugger}}',

      result: {
        rule: 'no-debugger',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{debugger}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{debugger}}',

      result: {
        rule: 'no-debugger',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{debugger}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{#debugger}}Invalid!{{/debugger}}',

      result: {
        rule: 'no-debugger',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{#debugger}}Invalid!{{/debugger}}',
        line: 1,
        column: 0
      }
    }
  ]
});
