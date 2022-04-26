import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-redundant-landmark-role',

  config: true,

  good: [
    '<form role="search"></form>',
    '<footer role={{this.foo}}></footer>',
    '<footer role="{{this.stuff}}{{this.foo}}"></footer>',
    '<nav role="navigation"></nav>',
    '<body role="document"></body>',
    {
      config: {
        checkAllElementRoles: true,
      },
      template: '<button role="link"></button>',
    },
    {
      config: {
        checkAllElementRoles: true,
      },
      template: '<input type="checkbox" value="yes" checked />',
    },
    {
      config: {
        checkAllElementRoles: true,
      },
      template: '<nav class="navigation" role="navigation></nav>',
    },
    {
      config: {
        checkAllElementRoles: false,
      },
      template: '<input type="range" />',
    },
    {
      config: {
        checkAllElementRoles: false,
      },
      template: '<dialog role="dialog" />',
    },
    {
      config: {
        checkAllElementRoles: false,
      },
      template: '<ul class="list" role="combobox"></ul>',
    },
  ],

  bad: [
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
              "rule": "no-redundant-landmark-role",
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
              "rule": "no-redundant-landmark-role",
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
              "rule": "no-redundant-landmark-role",
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
              "rule": "no-redundant-landmark-role",
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
              "rule": "no-redundant-landmark-role",
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<header role=\\"banner\\" class=\\"page-header\\"></header>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllElementRoles: true },
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<button role=\\"button\\"></button>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllElementRoles: true },
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<input type=\\"checkbox\\" name=\\"agree\\" value=\\"checkbox1\\" role=\\"checkbox\\" />",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllElementRoles: true },
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<th role=\\"columnheader\\">Some heading</th>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllElementRoles: true },
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<select name=\\"color\\" id=\\"color\\" role=\\"listbox\\" multiple><option value=\\"default-color\\">black</option></select>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllElementRoles: false },
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<main role=\\"main\\"></main>",
            },
          ]
        `);
      },
    },
    {
      config: { checkAllElementRoles: false },
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
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<aside role=\\"complementary\\"></aside>",
            },
          ]
        `);
      },
    },
  ],
});
