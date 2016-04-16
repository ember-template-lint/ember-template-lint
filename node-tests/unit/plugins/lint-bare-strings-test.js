'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'bare-strings',

  config: true,

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
    '<div placeholder="wat?"></div>',

    {
      // config as array is whitelist of chars
      config: ['/', '"'],
      template: '{{t "foo"}} / "{{name}}"'
    },

    {
      config: true,
      template: '\n {{translate "greeting"}},'
    },

    {
      config: false,
      template: '\nfoobar'
    },

    {
      // override the globalAttributes list
      config: { globalAttributes: [] },
      template: '<a title="hahaha trolol"></a>'
    },

    {
      // override the elementAttributes list
      config: { elementAttributes: { }},
      template: '<input placeholder="hahaha">'
    }
  ],

  bad: [
    { template: '\n howdy', message: "Non-translated string used (\'layout.hbs\'@ L1:C0): `\n howdy`." },
    { template: '<div>\n  1234\n</div>', message: "Non-translated string used (\'layout.hbs\'@ L1:C5): `\n  1234\n`." },

    {
      template: '<a title="hahaha trolol"></a>',
      message: "Non-translated string used in `title` attribute ('layout.hbs'@ L1:C4): `hahaha trolol`."
    },

    {
      template: '<input placeholder="trolol">',
      message: "Non-translated string used in `placeholder` attribute ('layout.hbs'@ L1:C8): `trolol`."
    },

    {
      config: { globalAttributes: ['data-foo'] },
      template: '<div data-foo="derpy"></div>',
      message: "Non-translated string used in `data-foo` attribute ('layout.hbs'@ L1:C6): `derpy`."
    },

    {
      config: { elementAttributes: { img: ['data-alt']} },
      template: '<img data-alt="some alternate here">',
      message: "Non-translated string used in `data-alt` attribute ('layout.hbs'@ L1:C6): `some alternate here`."
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
