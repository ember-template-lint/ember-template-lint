'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-input-block').message;

generateRuleTests({
  name: 'no-input-block',

  config: true,

  good: ['{{button}}', '{{#x-button}}{{/x-button}}', '{{input}}'],

  bad: [
    {
      template: '{{#input}}{{/input}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '{{#input}}{{/input}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
