'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'inline-styles',

  config: true,

  good: [
    '<div></div>',
    '<span></span>',
    '<ul class="dummy"></ul>'
  ],

  bad: [
    {
      template: '<div style="width: 100px"></div>',

      result: {
        rule: 'inline-styles',
        message: 'elements cannot have inline styles',
        moduleId: 'layout.hbs',
        source: 'style="width: 100px"',
        line: 1,
        column: 5
      }
    }
  ]
});
