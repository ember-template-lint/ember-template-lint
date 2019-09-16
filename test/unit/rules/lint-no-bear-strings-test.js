'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-bear-strings',

  config: true,

  good: [
    '{{t "howdy"}}',
    {
      template: '\n {{translate "greeting"}}',
    },
    {
      template: '\n {{translate "greeting"}},',
    },
    {
      template: '\nfoo',
    },
  ],

  bad: [
    {
      template: '🧸',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used',
        line: 1,
        column: 0,
        source: '🧸',
      },
    },
    {
      template: '🐻',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used',
        line: 1,
        column: 0,
        source: '🐻',
      },
    },
  ],
});
