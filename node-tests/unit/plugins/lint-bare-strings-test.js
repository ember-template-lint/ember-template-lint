'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'bare-strings',

  good: [
    '{{t "howdy"}}',
    {
      config: [','],
      template: '\n {{translate "greeting"}},'
    },
    {
      config: ['foo'],
      template: '\nfoo'
    },
    {
      config: ['/', '"'],
      template: '{{t "foo"}} / "{{name}}"'
    }
  ],

  bad: [
    { template: '\n howdy', message: "Non-translated string used (\'layout.hbs\') `\n howdy`" }
  ]
});
