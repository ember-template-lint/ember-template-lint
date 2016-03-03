'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'bare-strings',

  good: [
    '{{t "howdy"}}'
  ],

  bad: [
    { template: '\n howdy', message: "Non-translated string used (\'layout.hbs\') `\n howdy`" }
  ]
});
