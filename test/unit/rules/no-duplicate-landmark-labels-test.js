'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const rule = require('../../../lib/rules/no-duplicate-landmark-labels');

const { createErrorMessage } = rule;

generateRuleTests({
  name: 'no-duplicate-landmark-labels',

  config: true,

  good: ['passingTest00'],

  bad: [
    {
      template: '<nav></nav><nav></nav>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('nav'),
        line: 1,
        column: 11,
        source: '<nav></nav>',
      },
    },
    {
      template: '<main></main><div role="main"></div>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('div'),
        line: 1,
        column: 13,
        source: '<div role="main"></div>',
      },
    },
    {
      template: '<nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('nav'),
        line: 1,
        column: 40,
        source: '<nav aria-label="site navigation"></nav>',
      },
    },
  ],
});
