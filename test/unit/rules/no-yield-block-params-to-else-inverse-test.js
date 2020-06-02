'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-yield-block-params-to-else-inverse')
  .ERROR_MESSAGE;

generateRuleTests({
  name: 'no-yield-block-params-to-else-inverse',

  config: true,

  good: [
    '{{yield}}',
    '{{yield to="whatever"}}',
    '{{yield to=this.someValue}}',
    '{{yield to=(get some this.map)}}',
  ],

  bad: [
    {
      template: '{{yield "some" "param" to="else"}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{yield "some" "param" to="else"}}',
      },
    },
    {
      template: '{{yield "some" "param" to="inverse"}}',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{yield "some" "param" to="inverse"}}',
      },
    },
  ],
});
