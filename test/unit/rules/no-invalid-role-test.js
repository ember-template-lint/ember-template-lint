import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-invalid-role',

  config: true,

  good: [
    '<div></div>',
    '<div role="none"></div>',
    '<div role="presentation"></div>',
    '<img alt="" role="none">',
    '<img role="none">',
    '<img alt="" role="presentation">',
    '<img role="presentation">',
    '<span role="none"></span>',
    '<span role="presentation"></span>',
    '<svg role="none"></svg>',
    '<svg role="presentation"></svg>',
    '<li role="none"></li>',
    '<li role="presentation"></li>',
    '<custom-component role="none"></custom-component>',
    '<AwesomeThing role="none"></AwesomeThing>',
    '<AwesomeThing role="presentation"></AwesomeThing>',
    '<table role="textbox"></table>', // Random role on this element.
    '<div role="{{if this.inModal "dialog" "contentinfo" }}"></div>',
    {
      config: {
        catchNonexistentRoles: false,
      },
      template: '<div role="command interface"></div>',
    },
  ],

  bad: [
    {
      template: '<ul role="presentation"></ul>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <ul> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<ul role="presentation"></ul>",
            },
          ]
        `);
      },
    },
    {
      template: '<ol role="presentation"></ol>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <ol> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<ol role="presentation"></ol>",
            },
          ]
        `);
      },
    },
    {
      template: '<table role="presentation"></table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <table> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<table role="presentation"></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table role="none"></table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <table> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<table role="none"></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<button role="presentation"></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <button> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<button role="presentation"></button>",
            },
          ]
        `);
      },
    },
    {
      template: '<button role="none"></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <button> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<button role="none"></button>",
            },
          ]
        `);
      },
    },
    {
      template: '<label role="presentation"></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <label> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<label role="presentation"></label>",
            },
          ]
        `);
      },
    },
    {
      template: '<label role="none"></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of presentation role on <label> detected. Semantic elements should not be used for presentation.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<label role="none"></label>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="command interface"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of invalid role on <div> detected. Please refer here: https://www.w3.org/WAI/PF/aria/roles#widget_roles for valid list of roles that can be assigned.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<div role="command interface"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="command interface"></div>',
      config: {
        catchNonexistentRoles: true,
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of invalid role on <div> detected. Please refer here: https://www.w3.org/WAI/PF/aria/roles#widget_roles for valid list of roles that can be assigned.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<div role="command interface"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="COMMAND INTERFACE"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of invalid role on <div> detected. Please refer here: https://www.w3.org/WAI/PF/aria/roles#widget_roles for valid list of roles that can be assigned.",
              "rule": "no-invalid-role",
              "severity": 2,
              "source": "<div role="COMMAND INTERFACE"></div>",
            },
          ]
        `);
      },
    },
  ],
});
