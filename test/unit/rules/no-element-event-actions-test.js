import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-element-event-actions',

  config: true,

  good: [
    '<button></button>',
    '<button type="button" on={{action "myAction"}}></button>',
    '<button type="button" onclick="myFunction()"></button>',
    '<button type="button" {{action "myAction"}}></button>',
    '<button type="button" value={{value}}></button>',
    '{{my-component onclick=(action "myAction") someProperty=true}}',
    '<SiteHeader @someFunction={{action "myAction"}} @user={{this.user}} />',
    {
      config: { requireActionHelper: true },
      template: '<button type="button" onclick={{this.myAction}}></button>',
    },
    {
      config: { requireActionHelper: false },
      template: '<button type="button" onclick="myFunction()"></button>',
    },
  ],

  bad: [
    {
      template:
        '<button onclick={{action "myAction"}} ONFOCUS={{action "myAction"}} otherProperty=true></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{action \\"myAction\\"}}",
            },
            {
              "column": 38,
              "endColumn": 67,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "ONFOCUS={{action \\"myAction\\"}}",
            },
          ]
        `);
      },
    },

    {
      template: '<SiteHeader onclick={{action "myAction"}} @user={{this.user}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{action \\"myAction\\"}}",
            },
          ]
        `);
      },
    },

    {
      config: { requireActionHelper: false },
      template: '<button type="button" onclick={{this.myAction}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 22,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{this.myAction}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="button" onclick={{this.myAction}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 22,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use HTML element event properties like \`onclick\`. Instead, use the \`on\` modifier.",
              "rule": "no-element-event-actions",
              "severity": 2,
              "source": "onclick={{this.myAction}}",
            },
          ]
        `);
      },
    },
  ],

  error: [
    {
      config: null,
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `null`',
      },
    },
    {
      config: 'true',
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `"true"`',
      },
    },
    {
      config: { invalidOption: true },
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{"invalidOption":true}`',
      },
    },
    {
      config: { requireActionHelper: 'true' },
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{"requireActionHelper":"true"}`',
      },
    },
  ],
});
