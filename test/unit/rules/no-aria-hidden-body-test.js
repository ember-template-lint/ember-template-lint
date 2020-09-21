'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-aria-hidden-body');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-aria-hidden-body',

  config: true,

  good: ['<body></body>', '<body><h1>Hello world</h1></body>'],

  bad: [
    {
      template: '<body aria-hidden="true"></body>',
      fixedTemplate: '<body></body>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<body aria-hidden="true"></body>',
        isFixable: true,
      },
    },
    {
      template: '<body aria-hidden></body>',
      fixedTemplate: '<body></body>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<body aria-hidden></body>',
        isFixable: true,
      },
    },
  ],
});
