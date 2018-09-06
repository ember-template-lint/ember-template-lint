'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-bare-strings',

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
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',

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
      config: ['₹'],
      template: '&#8377;'
    },

    {
      // override the globalAttributes list
      config: { globalAttributes: [] },
      template: '<a title="hahaha trolol"></a>'
    },

    {
      // override the globalAttributes list
      config: { globalAttributes: [] },
      template: '<script>var foo = "bar"</script>'
    },

    {
      // override the elementAttributes list
      config: { elementAttributes: { }},
      template: '<input placeholder="hahaha">'
    },

    '<foo-bar>\n</foo-bar>',

    {
      // combine bare string with a variable
      config: ['X'],
      template: '<input placeholder="{{foo}}X">'
    },

    '{{! template-lint-disable bare-strings}}LOL{{! template-lint-enable bare-strings}}',

    `{{!-- template-lint-disable bare-strings --}}
<i class="material-icons">folder_open</i>
{{!-- template-lint-enable bare-strings --}}`,
    '<div data-test-foo-bar></div>',
  ],

  bad: [
    {
      template: '\n howdy',

      result: {
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
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `title` attribute',
        line: 1,
        column: 3,
        source: 'hahaha trolol'
      }
    },

    {
      template: '<input placeholder="trolol">',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `placeholder` attribute',
        line: 1,
        column: 7,
        source: 'trolol'
      }
    },

    {
      template: '<input placeholder="{{foo}}hahaha trolol">',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `placeholder` attribute',
        line: 1,
        column: 7,
        source: 'hahaha trolol'
      }
    },

    {
      template: '<div role="contentinfo" aria-label="Contact, Policies and Legal"></div>',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `aria-label` attribute',
        line: 1,
        column: 24,
        source: 'Contact, Policies and Legal'
      }
    },

    {
      template: '<div contenteditable role="searchbox" aria-placeholder="Search for things"></div>',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `aria-placeholder` attribute',
        line: 1,
        column: 38,
        source: 'Search for things'
      }
    },

    {
      template: '<div role="region" aria-roledescription="slide"></div>',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `aria-roledescription` attribute',
        line: 1,
        column: 19,
        source: 'slide'
      }
    },

    {
      template: '<div role="slider" aria-valuetext="Off" tabindex="0" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3"></div>',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `aria-valuetext` attribute',
        line: 1,
        column: 19,
        source: 'Off'
      }
    },

    {
      config: { globalAttributes: ['data-foo'] },
      template: '<div data-foo="derpy"></div>',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `data-foo` attribute',
        line: 1,
        column: 5,
        source: 'derpy'
      }
    },

    {
      config: { elementAttributes: { img: ['data-alt']} },
      template: '<img data-alt="some alternate here">',

      result: {
        moduleId: 'layout.hbs',
        message: 'Non-translated string used in `data-alt` attribute',
        line: 1,
        column: 5,
        source: 'some alternate here'
      }
    },

    {
      // multiple bare strings are all logged
      template: '<div>Bady\n  <input placeholder="trolol">\n</div>',
      results: [
        {
          moduleId: 'layout.hbs',
          message: 'Non-translated string used',
          line: 1,
          column: 5,
          source: 'Bady\n  '
        }, {
          moduleId: 'layout.hbs',
          message: 'Non-translated string used in `placeholder` attribute',
          line: 2,
          column: 9,
          source: 'trolol'
        }
      ]
    }
  ]
});
