'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-unbalanced-curlies').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-unbalanced-curlies',

  config: true,

  good: ['{foo}', '{{foo}}', '{{{foo}}}', '{{{foo\n}}}'],

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
    {
      template: '{foo\n}}}',
      result: {
        message: ERROR_MESSAGE,
        line: 2,
        column: 1,
        source: '{foo\n}}}',
      },
    },
    {
      template: '{foo\n}}}\nbar',
      result: {
        message: ERROR_MESSAGE,
        line: 2,
        column: 1,
        source: '{foo\n}}}\nbar',
      },
    },
    {
      template: '{foo\r\nbar\r\n\r\nbaz}}}',
      result: {
        message: ERROR_MESSAGE,
        line: 4,
        column: 4,
        source: '{foo\r\nbar\r\n\r\nbaz}}}',
      },
    },
    {
      template: '{foo\rbar\r\rbaz}}}',
      result: {
        message: ERROR_MESSAGE,
        line: 4,
        column: 4,
        source: '{foo\rbar\r\rbaz}}}',
      },
    },
  ],
});
