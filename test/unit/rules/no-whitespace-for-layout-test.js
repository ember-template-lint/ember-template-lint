// no-whitespace-for-layout-test.js

'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-whitespace-for-layout');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-whitespace-for-layout',
  config: true,

  good: [
    'Start to finish',
    'Start&nbsp;to&nbsp;finish',
    'Start<br>to<br>finish',
    '<div>\n  example\n</div>',
    '<div\n  foo="bar"\n  baz="qux"\n>\n  example\n</div>',
  ],

  bad: [
    {
      template: 'START  FINISH',

      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START  FINISH',
      },
    },
    {
      template: 'START&nbsp;&nbsp;FINISH',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START&nbsp;&nbsp;FINISH',
      },
    },
    {
      template: 'START&nbsp; FINISH',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START&nbsp; FINISH',
      },
    },
    {
      template: 'START &nbsp;FINISH',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START &nbsp;FINISH',
      },
    },
  ],
});
