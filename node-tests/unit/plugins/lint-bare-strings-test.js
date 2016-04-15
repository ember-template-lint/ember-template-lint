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
    { template: '\n howdy', message: "Non-translated string used (\'layout.hbs\'@ L1:C0) `\n howdy`" },
    { template: '<div>\n  1234\n</div>', message: "Non-translated string used (\'layout.hbs\'@ L1:C5) `\n  1234\n`" }
  ]
});
