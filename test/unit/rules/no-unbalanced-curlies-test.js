'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-unbalanced-curlies').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-unbalanced-curlies',

  config: true,

  good: ['{foo}', '{{foo}}', '{{{foo}}}'],

  bad: [
    {
      template: 'foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 3,
        source: 'foo}}',
      },
    },
    {
      template: '{foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 4,
        source: '{foo}}',
      },
    },
    {
      template: 'foo}}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 3,
        source: 'foo}}}',
      },
    },
    {
      template: '{foo}}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 4,
        source: '{foo}}}',
      },
    },
  ],
});
