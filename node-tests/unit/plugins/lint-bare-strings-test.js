'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'bare-strings',

  config: ['(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}'],

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
    },
    '{{t "foo"}}',
    '{{t "foo"}}, {{t "bar"}} ({{length}})',
    '(),.&+-=*/#%!?:[]{}',
    '<!-- template-lint bare-strings=false -->',
    '<!-- template-lint enabled=false -->'
  ],

  bad: [
    { template: '\n howdy', message: "Non-translated string used (\'layout.hbs\') `\n howdy`" },
    { template: '1234', message: "Non-translated string used (\'layout.hbs\') `1234`" }
  ]
});
