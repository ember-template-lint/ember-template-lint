'use strict';

const rule = require('../../../lib/rules/no-bare-strings');
const generateRuleTests = require('../../helpers/rule-test-harness');

describe('imports', () => {
  it('should expose the default config', () => {
    expect(rule.DEFAULT_CONFIG).toEqual(
      expect.objectContaining({
        allowlist: expect.arrayContaining(['&lpar;']),
        whitelist: expect.arrayContaining(['&lpar;']),
        globalAttributes: expect.arrayContaining(['title']),
        elementAttributes: expect.any(Object),
      })
    );
  });
});

generateRuleTests({
  name: 'no-bare-strings',

  config: true,

  good: [
    '{{t "howdy"}}',
    '<CustomInput @type={{"range"}} />',
    {
      config: [''],
      template: '\n {{translate "greeting"}}',
    },
    {
      config: [','],
      template: '\n {{translate "greeting"}},',
    },
    {
      config: ['foo'],
      template: '\nfoo',
    },
    {
      config: ['tarzan!'],
      template: 'tarzan!\t\n  tarzan!',
    },
    {
      config: ['/', '"'],
      template: '{{t "foo"}} / "{{name}}"',
    },
    {
      config: ['&', '&times;', '4', '3=12'],
      template: '4 &times; 3=12',
    },
    {
      config: ['&', '&times;', 'Tom', 'Jerry'],
      template: 'Tom & Jerry',
    },
    {
      config: ['&', '&times;'],
      template: '& &times;',
    },
    '{{t "foo"}}',
    '{{t "foo"}}, {{t "bar"}} ({{length}})',
    '(),.&+-=*/#%!?:[]{}',
    '&lpar;&rpar;&comma;&period;&amp;&nbsp;',
    '&mdash;&ndash;',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
    '<script> fdff sf sf f </script>',
    '<style> fdff sf sf f </style>',
    '<pre> fdff sf sf f </pre>',
    '<template> fdff sf sf f </template>',
    '<script> fdff sf sf <div> aaa </div> f </script>',
    '<style> fdff sf sf <div> aaa </div> f </style>',
    '<pre> fdff sf sf <div> aaa </div> f </pre>',
    '<template> fdff sf sf <div> aaa </div> f </template>',
    '<textarea> this is an input</textarea>',
    // placeholder is a <input> specific attribute
    '<div placeholder="wat?"></div>',

    {
      // config as array is whitelist of chars
      config: ['/', '"'],
      template: '{{t "foo"}} / "{{name}}"',
    },

    {
      config: true,
      template: '\n {{translate "greeting"}},',
    },

    {
      config: false,
      template: '\nfoobar',
    },

    {
      config: ['₹'],
      template: '&#8377;',
    },

    {
      // override the globalAttributes list
      config: { globalAttributes: [] },
      template: '<a title="hahaha trolol"></a>',
    },

    {
      // override the elementAttributes list
      config: { elementAttributes: {} },
      template: '<input placeholder="hahaha">',
    },

    {
      // combine bare string with a variable
      config: ['X'],
      template: '<input placeholder="{{foo}}X">',
    },

    {
      // deprecated `whitelist` config
      config: { whitelist: ['Z'] },
      template: '<p>Z</p>',
    },

    {
      // `allowlist` supercedes deprecated `whitelist` config
      config: { allowlist: ['Y'], whitelist: ['Z'] },
      template: '<p>Y</p>',
    },

    '<foo-bar>\n</foo-bar>',
    '{{! template-lint-disable no-bare-strings}}LOL{{! template-lint-enable no-bare-strings}}',
    `{{!-- template-lint-disable no-bare-strings --}}
<i class="material-icons">folder_open</i>
{{!-- template-lint-enable no-bare-strings --}}`,
    '<div data-test-foo-bar></div>',
  ],

  bad: [
    {
      template: '<p>{{"Hello!"}}</p>',
      result: {
        message: 'Non-translated string used',
        line: 1,
        column: 3,
        source: 'Hello!',
      },
    },
    {
      template: '\n howdy',

      result: {
        message: 'Non-translated string used',
        line: 1,
        column: 0,
        source: '\n howdy',
      },
    },
    {
      template: '<div>\n  1234\n</div>',

      result: {
        message: 'Non-translated string used',
        line: 1,
        column: 5,
        source: '\n  1234\n',
      },
    },

    {
      template: '<a title="hahaha trolol"></a>',

      result: {
        message: 'Non-translated string used in `title` attribute',
        line: 1,
        column: 3,
        source: 'hahaha trolol',
      },
    },

    {
      template: '<input placeholder="trolol">',

      result: {
        message: 'Non-translated string used in `placeholder` attribute',
        line: 1,
        column: 7,
        source: 'trolol',
      },
    },

    {
      template: '<input placeholder="{{foo}}hahaha trolol">',

      result: {
        message: 'Non-translated string used in `placeholder` attribute',
        line: 1,
        column: 7,
        source: 'hahaha trolol',
      },
    },

    {
      template: '<div role="contentinfo" aria-label="Contact, Policies and Legal"></div>',

      result: {
        message: 'Non-translated string used in `aria-label` attribute',
        line: 1,
        column: 24,
        source: 'Contact, Policies and Legal',
      },
    },

    {
      template: '<div contenteditable role="searchbox" aria-placeholder="Search for things"></div>',

      result: {
        message: 'Non-translated string used in `aria-placeholder` attribute',
        line: 1,
        column: 38,
        source: 'Search for things',
      },
    },

    {
      template: '<div role="region" aria-roledescription="slide"></div>',

      result: {
        message: 'Non-translated string used in `aria-roledescription` attribute',
        line: 1,
        column: 19,
        source: 'slide',
      },
    },

    {
      template:
        '<div role="slider" aria-valuetext="Off" tabindex="0" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3"></div>',

      result: {
        message: 'Non-translated string used in `aria-valuetext` attribute',
        line: 1,
        column: 19,
        source: 'Off',
      },
    },

    {
      config: { globalAttributes: ['data-foo'] },
      template: '<div data-foo="derpy"></div>',

      result: {
        message: 'Non-translated string used in `data-foo` attribute',
        line: 1,
        column: 5,
        source: 'derpy',
      },
    },

    {
      config: { elementAttributes: { img: ['data-alt'] } },
      template: '<img data-alt="some alternate here">',

      result: {
        message: 'Non-translated string used in `data-alt` attribute',
        line: 1,
        column: 5,
        source: 'some alternate here',
      },
    },

    {
      // multiple bare strings are all logged
      template: '<div>Bady\n  <input placeholder="trolol">\n</div>',
      results: [
        {
          message: 'Non-translated string used',
          line: 1,
          column: 5,
          source: 'Bady\n  ',
        },
        {
          message: 'Non-translated string used in `placeholder` attribute',
          line: 2,
          column: 9,
          source: 'trolol',
        },
      ],
    },

    {
      // deprecated `whitelist` config - rule still logs normally
      config: { whitelist: ['Z'] },
      template: '<p>Y</p>',
      results: [
        {
          message: 'Non-translated string used',
          line: 1,
          column: 3,
          source: 'Y',
        },
      ],
    },

    {
      // `allowlist` supercedes deprecated `whitelist` config
      config: { allowlist: ['Y'], whitelist: ['Z'] },
      template: '<p>Z</p>',
      results: [
        {
          message: 'Non-translated string used',
          line: 1,
          column: 3,
          source: 'Z',
        },
      ],
    },
  ],
});
