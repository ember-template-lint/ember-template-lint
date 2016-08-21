'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');
var message = require('../../../lib/rules/lint-only-block-link-to').message;

generateRuleTests({
  name: 'only-block-link-to',

  config: true,

  good: [
    '{{#link-to \'routeName\' prop}}Link text{{/link-to}}',
    '{{#link-to \'routeName\'}}Link text{{/link-to}}'
  ],

  bad: [
    {
      template: '{{link-to \'Link text\' \'routeName\'}}',

      result: {
        rule: 'only-block-link-to',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{link-to \'Link text\' \'routeName\'}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{link-to \'Link text\' \'routeName\' one two}}',

      result: {
        rule: 'only-block-link-to',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{link-to \'Link text\' \'routeName\' one two}}',
        line: 1,
        column: 0
      }
    }
  ]
});
