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
    {
      template: '\n howdy',

      result: {
        rule: 'bare-strings',
        moduleId: 'layout.hbs',
        message: 'Non-translated string used',
        line: 1,
        column: 0,
        source: '\n howdy'
      }
    },
    {
      template: '<div>\n  1234\n</div>',

      result: {
        rule: 'bare-strings',
        moduleId: 'layout.hbs',
        message: 'Non-translated string used',
        line: 1,
        column: 5,
        source: '\n  1234\n'
      }
    },

    {
      template: '<a title="hahaha trolol"></a>',

      result: {
        rule: 'bare-strings',
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `title` attribute',
        line: 1,
        column: 4,
        source: 'hahaha trolol'
      }
    },

    {
      template: '<input placeholder="trolol">',

      result: {
        rule: 'bare-strings',
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `placeholder` attribute',
        line: 1,
        column: 8,
        source: 'trolol'
      }
    },

    {
      config: { globalAttributes: ['data-foo'] },
      template: '<div data-foo="derpy"></div>',

      result: {
        rule: 'bare-strings',
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `data-foo` attribute',
        line: 1,
        column: 6,
        source: 'derpy'
      }
    },

    {
      config: { elementAttributes: { img: ['data-alt']} },
      template: '<img data-alt="some alternate here">',

      result: {
        rule: 'bare-strings',
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `data-alt` attribute',
        line: 1,
        column: 6,
        source: 'some alternate here'
      }
    },

    {
      // multiple bare strings are all logged
      template: '<div>Bady\n  <input placeholder="trolol">\n</div>',
      results: [
        {
          rule: 'bare-strings',
          moduleId: 'layout.hbs',
          message: 'Non-translated string used',
          line: 1,
          column: 5,
          source: 'Bady\n  '
        }, {
          rule: 'bare-strings',
          moduleId: 'layout.hbs',
          message: 'Non-translated string used in `placeholder` attribute',
          line: 2,
          column: 10,
          source: 'trolol'
        }
      ]
    }
  ]
});
