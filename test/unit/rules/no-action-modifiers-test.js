import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-action-modifiers',

  config: true,

  good: [
    '<button onclick={{action "foo"}}></button>',
    '<a href="#" onclick={{action "foo"}}></a>',
    '<div action></div>',
    '{{foo-bar (action "foo")}}',
    '{{foo-bar action}}',

    {
      config: ['button'],
      template: '<button {{action "foo"}}></button>',
    },
  ],

  bad: [
    {
      template: '<button {{action "foo"}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use the \`action\` modifier. Instead, use the \`on\` modifier.",
              "rule": "no-action-modifiers",
              "severity": 2,
              "source": "<button {{action "foo"}}></button>",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="#" {{action "foo"}}></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use the \`action\` modifier. Instead, use the \`on\` modifier.",
              "rule": "no-action-modifiers",
              "severity": 2,
              "source": "<a href="#" {{action "foo"}}></a>",
            },
          ]
        `);
      },
    },
    {
      config: ['button'],
      template: '<a href="#" {{action "foo"}}></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use the \`action\` modifier. Instead, use the \`on\` modifier.",
              "rule": "no-action-modifiers",
              "severity": 2,
              "source": "<a href="#" {{action "foo"}}></a>",
            },
          ]
        `);
      },
    },
  ],
});
