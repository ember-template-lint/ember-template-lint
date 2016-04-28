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
    { template: '\n {{{foo}}}', message: 'Usage of triple curly brackets is unsafe `{{{foo}}}` at (\'layout.hbs\'@ L2:C1)' }
  ]
});
