'use strict';

const rule = require('../../../lib/rules/no-bare-strings');
const generateRuleTests = require('../../helpers/rule-test-harness');

describe('imports', () => {
  it('should expose the default config', () => {
    expect(rule.DEFAULT_CONFIG).toEqual(
      expect.objectContaining({
        allowlist: expect.arrayContaining(['&lpar;']),
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
      // config as array is allowlist of chars
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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "Hello!",
            },
          ]
        `);
      },
    },
    {
      template: '\n howdy',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "
           howdy",
            },
          ]
        `);
      },
    },
    {
      template: '<div>\n  1234\n</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "
            1234
          ",
            },
          ]
        `);
      },
    },

    {
      template: '<a title="hahaha trolol"></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`title\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "hahaha trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<input placeholder="trolol">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`placeholder\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<input placeholder="{{foo}}hahaha trolol">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`placeholder\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "hahaha trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<Input placeholder="{{foo}}hahaha trolol" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`placeholder\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "hahaha trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<Textarea placeholder="{{foo}}hahaha trolol" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`placeholder\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "hahaha trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<Input @placeholder="{{foo}}hahaha trolol" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`@placeholder\` argument",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "hahaha trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<Textarea @placeholder="{{foo}}hahaha trolol" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`@placeholder\` argument",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "hahaha trolol",
            },
          ]
        `);
      },
    },

    {
      template: '<div role="contentinfo" aria-label="Contact, Policies and Legal"></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 24,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`aria-label\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "Contact, Policies and Legal",
            },
          ]
        `);
      },
    },

    {
      template: '<div contenteditable role="searchbox" aria-placeholder="Search for things"></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 38,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`aria-placeholder\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "Search for things",
            },
          ]
        `);
      },
    },

    {
      template: '<div role="region" aria-roledescription="slide"></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`aria-roledescription\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "slide",
            },
          ]
        `);
      },
    },

    {
      template:
        '<div role="slider" aria-valuetext="Off" tabindex="0" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3"></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`aria-valuetext\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "Off",
            },
          ]
        `);
      },
    },

    {
      config: { globalAttributes: ['data-foo'] },
      template: '<div data-foo="derpy"></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`data-foo\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "derpy",
            },
          ]
        `);
      },
    },

    {
      config: { elementAttributes: { img: ['data-alt'] } },
      template: '<img data-alt="some alternate here">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Non-translated string used in \`data-alt\` attribute",
              "rule": "no-bare-strings",
              "severity": 2,
              "source": "some alternate here",
            },
          ]
        `);
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
  ],
});
