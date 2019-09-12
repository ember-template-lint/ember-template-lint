// no-whitespace-for-layout-test.js

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/lint-no-whitespace-for-layout').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-whitespace-for-layout',
  config: true,

  good: ['START FINISH', 'START&nbsp;FINISH'],

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
