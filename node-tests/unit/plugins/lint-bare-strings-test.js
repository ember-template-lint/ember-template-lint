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
      config: ['tarzan!'],
      template: 'tarzan!\t\n  tarzan!'
    },
    {
      config: ['/', '"'],
      template: '{{t "foo"}} / "{{name}}"'
    },
    '{{t "foo"}}',
    '{{t "foo"}}, {{t "bar"}} ({{length}})',
    '(),.&+-=*/#%!?:[]{}',
    '<!-- template-lint bare-strings=false -->',
    '<!-- template-lint enabled=false -->',

    // placeholder is a <input> specific attribute
    '<div placeholder="wat?"></div>'
  ],

  bad: [
    { template: '\n howdy', message: "Non-translated string used (\'layout.hbs\'@ L1:C0): `\n howdy`." },
    { template: '<div>\n  1234\n</div>', message: "Non-translated string used (\'layout.hbs\'@ L1:C5): `\n  1234\n`." },

    {
      template: '<input placeholder="trolol">',
      message: "Non-translated string used in `placeholder` attribute ('layout.hbs'@ L1:C8): `trolol`."
    },

    {
      template: '<input placeholder="trolol">',
      message: "Non-translated string used in `placeholder` attribute ('layout.hbs'@ L1:C8): `trolol`."
    },

    {
      // multiple bare strings are all logged
      template: '<div>Bady\n  <input placeholder="trolol">\n</div>',
      messages: [
        "Non-translated string used (\'layout.hbs\'@ L1:C5): `Bady\n  `.",
        "Non-translated string used in `placeholder` attribute ('layout.hbs'@ L2:C10): `trolol`."
      ]
    }
  ]
});
