import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-class-bindings',

  config: true,

  good: ['<SomeThing />', '{{lol-wat}}', '{{true}}', '{{"hehe"}}'],

  bad: [
    {
      template: '{{some-thing classBinding="lol:wat"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:wat\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing @classBinding="lol:wat" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`@classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classBinding=\\"lol:wat\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{some-thing classNameBindings="lol:foo:bar"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classNameBindings=\\"lol:foo:bar\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing @classNameBindings="lol:foo:bar" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo:bar\\"",
            },
          ]
        `);
      },
    },
  ],
});
