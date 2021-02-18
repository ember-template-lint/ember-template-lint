'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-class-bindings',

  config: true,

  good: ['<SomeThing />', '{{lol-wat}}', '{{true}}', '{{"hehe"}}'],

  bad: [
    {
      template: '{{some-thing classNames="lol"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`classNames\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classNames=\\"lol\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing @classNames="lol" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Passing the \`@classNames\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNames=\\"lol\\"",
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
