'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'triple-curlies',

  config: true,

  good: [
    '{{foo}}',
    '<!-- template-lint bare-strings=false -->',
    '<!-- template-lint enabled=false -->'
  ],

  bad: [
    {
      template: '\n {{{foo}}}',

      result: {
        rule: 'triple-curlies',
        message: 'Usage of triple curly brackets is unsafe',
        moduleId: 'layout.hbs',
        source: '{{{foo}}}',
        line: 2,
        column: 1
      }
    }
  ]
});
