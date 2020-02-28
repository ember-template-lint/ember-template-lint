'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/placeholder-for-dasherized-rule').ERROR_MESSAGE;

generateRuleTests({
  name: 'placeholder-for-dasherized-rule',

  config: true,

  // TODO update with a good example that should pass
  good: ['passingTest00'],

  // TODO update with tests that should fail
  bad: [
    {
      template: 'FailingTest00 -- contains DisallowedText',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'FailingTest00 -- contains DisallowedText',
      },
    },
  ],
});
