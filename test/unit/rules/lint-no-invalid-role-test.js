'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/lint-no-invalid-role');

const ERROR_MESSAGE_INVALID_ROLE = rule.ERROR_MESSAGE_INVALID_ROLE;

generateRuleTests({
  name: 'no-invalid-role',

  config: true,

  good: [
    '<div></div>',
    '<div role="none"></div>',
    '<div role="presentation"></div>',
    '<img role="none">',
    '<img role="presentation">',
    '<span role="none"></span>',
    '<span role="presentation"></span>',
    '<svg role="none"></svg>',
    '<svg role="presentation"></svg>',
  ],

  bad: [
    {
      template: '<ul role="presentation"></ul>',
      result: {
        message: ERROR_MESSAGE_INVALID_ROLE('ul'),
        moduleId: 'layout.hbs',
        source: '<ul role="presentation"></ul>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table role="presentation"></table>',
      result: {
        message: ERROR_MESSAGE_INVALID_ROLE('table'),
        moduleId: 'layout.hbs',
        source: '<table role="presentation"></table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table role="none"></table>',
      result: {
        message: ERROR_MESSAGE_INVALID_ROLE('table'),
        moduleId: 'layout.hbs',
        source: '<table role="none"></table>',
        line: 1,
        column: 0,
      },
    },
  ],
});
