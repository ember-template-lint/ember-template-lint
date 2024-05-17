import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-redundant-role',

  config: true,

  good: [
    '<form role="search"></form>',
    '<footer role={{this.foo}}></footer>',
    '<footer role="{{this.stuff}}{{this.foo}}"></footer>',
    '<nav role="navigation"></nav>',
    '<ol role="list"></ol>',
    '<ul role="list"></ul>',
    {
      config: { checkAllHTMLElements: false },
      template: '<body role="document"></body>',
    },
    {
      config: { checkAllHTMLElements: true },
      template: '<footer role={{this.bar}}></footer>',
    },
    {
      config: {
        checkAllHTMLElements: true,
      },
      template: '<nav class="navigation" role="navigation></nav>',
    },
    {
      config: {
        checkAllHTMLElements: true,
      },
      template: '<button role="link"></button>',
    },
    {
      config: {
        checkAllHTMLElements: true,
      },
      template: '<input type="checkbox" value="yes" checked />',
    },
    {
      config: {
        checkAllHTMLElements: false,
      },
      template: '<input type="range" />',
    },
    {
      config: {
        checkAllHTMLElements: false,
      },
      template: '<dialog role="dialog" />',
    },
    {
      config: {
        checkAllHTMLElements: false,
      },
      template: '<ul class="list" role="combobox"></ul>',
    },
    {
      config: {
        checkAllHTMLElements: false,
      },
      template: '<input role="combobox" />',
    },
  ],

  bad: [
    {
      // with no config, checkAllHTMLElements defaults to true
      template: '<dialog role="dialog" />',
      fixedTemplate: '<dialog />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: dialog on <dialog> detected.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<dialog role=\\"dialog\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<header role="banner"></header>',
      fixedTemplate: '<header></header>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<header role=\\"banner\\"></header>",
            },
          ]
        `);
      },
    },
    {
      template: '<footer role="contentinfo"></footer>',
      fixedTemplate: '<footer></footer>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: contentinfo on <footer> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<footer role=\\"contentinfo\\"></footer>",
            },
          ]
        `);
      },
    },
    {
      template: '<main role="main"></main>',
      fixedTemplate: '<main></main>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<main role=\\"main\\"></main>",
            },
          ]
        `);
      },
    },
    {
      template: '<aside role="complementary"></aside>',
      fixedTemplate: '<aside></aside>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<aside role=\\"complementary\\"></aside>",
            },
          ]
        `);
      },
    },
    {
      template: '<form role="form"></form>',
      fixedTemplate: '<form></form>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: form on <form> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<form role=\\"form\\"></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<header role="banner" class="page-header"></header>',
      fixedTemplate: '<header class="page-header"></header>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<header role=\\"banner\\" class=\\"page-header\\"></header>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllHTMLElements: true },
      template: '<button role="button"></button>',
      fixedTemplate: '<button></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: button on <button> detected.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<button role=\\"button\\"></button>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllHTMLElements: true },
      template: '<input type="checkbox" name="agree" value="checkbox1" role="checkbox" />',
      fixedTemplate: '<input type="checkbox" name="agree" value="checkbox1" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 72,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: checkbox on <input> detected.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<input type=\\"checkbox\\" name=\\"agree\\" value=\\"checkbox1\\" role=\\"checkbox\\" />",
            },
          ]
        `);
      },
    },
    // {
    //   config: { checkAllHTMLElements: true },
    //   template: '<input type="checkbox" name="agree" value="checkbox1" role="combobox" />',
    //   fixedTemplate: '<input type="checkbox" name="agree" value="checkbox1" />',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 0,
    //           "endColumn": 72,
    //           "endLine": 1,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 1,
    //           "message": "Use of redundant or invalid role: combobox on <input> detected.",
    //           "rule": "no-redundant-role",
    //           "severity": 2,
    //           "source": "<input type=\\"checkbox\\" name=\\"agree\\" value=\\"checkbox1\\" role=\\"combobox\\" />",
    //         },
    //       ]
    //     `);
    //   },
    // },
    {
      config: { checkAllHTMLElements: true },
      template: '<table><th role="columnheader">Some heading</th><td>cell1</td></table>',
      fixedTemplate: '<table><th>Some heading</th><td>cell1</td></table>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: columnheader on <th> detected.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<th role=\\"columnheader\\">Some heading</th>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllHTMLElements: true },
      template:
        '<select name="color" id="color" role="listbox" multiple><option value="default-color">black</option></select>',
      fixedTemplate:
        '<select name="color" id="color" multiple><option value="default-color">black</option></select>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 109,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: listbox on <select> detected.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<select name=\\"color\\" id=\\"color\\" role=\\"listbox\\" multiple><option value=\\"default-color\\">black</option></select>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllHTMLElements: false },
      template: '<main role="main"></main>',
      fixedTemplate: '<main></main>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<main role=\\"main\\"></main>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllHTMLElements: false },
      template: '<aside role="complementary"></aside>',
      fixedTemplate: '<aside></aside>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-role",
              "severity": 2,
              "source": "<aside role=\\"complementary\\"></aside>",
            },
          ]
        `);
      },
    },
  ],
});
