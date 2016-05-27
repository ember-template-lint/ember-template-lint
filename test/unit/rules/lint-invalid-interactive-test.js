'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'invalid-interactive',

  good: [

  ],

  bad: [
    {
      template: '<div {{action "foo"}}></div>',

      result: {
        message: 'Interaction added to non-interactive element.',
        line: 1,
        column: 0,
        source: '\n howdy'
      }
    }
  ]
});
