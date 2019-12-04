// no-whitespace-for-layout-test.js

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/no-whitespace-for-layout').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-whitespace-for-layout',
  config: true,

  good: ['Start to finish', 'Start&nbsp;to&nbsp;finish', 'Start<br>to<br>finish'],

  bad: [
    {
      template: 'START  FINISH',

      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START  FINISH',
      },
    },
    {
      template: 'START&nbsp;&nbsp;FINISH',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START&nbsp;&nbsp;FINISH',
      },
    },
    {
      template: 'START&nbsp; FINISH',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START&nbsp; FINISH',
      },
    },
    {
      template: 'START &nbsp;FINISH',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'START &nbsp;FINISH',
      },
    },
  ],
});
