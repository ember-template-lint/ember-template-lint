'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-class-bindings',

  config: true,

  good: ['<SomeThing />', '{{lol-wat}}', '{{true}}', '{{"hehe"}}'],

  bad: [
    {
      template: '{{some-thing classBinding="lol:wat"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
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
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`@classBinding\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
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
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`classNameBindings\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
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
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
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
