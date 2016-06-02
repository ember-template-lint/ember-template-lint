'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'invalid-interactive',

  config: true,

  good: [
    '<button {{action "foo"}}></button>',
    '<div role="button" {{action "foo"}}></div>'
  ],

  bad: [
    {
      template: '<div {{action "foo"}}></div>',

      result: {
        message: 'Interaction added to non-interactive element',
        line: 1,
        column: 5,
        source: '<div {{action \"foo\"}}></div>'
      }
    }
  ]
});
