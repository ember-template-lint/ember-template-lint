'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/no-redundant-landmark-role');

const { createErrorMessage } = rule;

generateRuleTests({
  name: 'no-redundant-landmark-role',

  config: true,

  // TODO update with a good example that should pass
  good: ['<form role="search"></form>', '<footer role="contentinfo"></footer>'],

  // TODO update with tests that should fail
  bad: [
    {
      template: '<header role="banner"></header>',
      result: {
        message: createErrorMessage('header'),
        line: 1,
        column: 0,
        source: '<header role="banner"></header>',
      },
    },
    {
      template: '<main role="main"></main>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 0,
        source: '<main role="main"></main>',
      },
    },
    {
      template: '<aside role="complementary"></aside>',
      result: {
        message: createErrorMessage('aside'),
        line: 1,
        column: 0,
        source: '<aside role="complementary"></aside>',
      },
    },
    {
      template: '<nav role="navigation"></nav>',
      result: {
        message: createErrorMessage('nav'),
        line: 1,
        column: 0,
        source: '<nav role="navigation"></nav>',
      },
    },
  ],
});
