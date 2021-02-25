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
              "isFixable": true,
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
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
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
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
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
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
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
    {
      template: '<SomeThing @classNameBindings={{@something}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings={{@something}}",
            },
          ]
        `);
      },
    },

    {
      template: '<SomeThing @classNameBindings="isTruthy" />',
      fixedTemplate: '<SomeThing class="{{if this.isTruthy "is-truthy"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"isTruthy\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing @classNameBindings="lol:foo:bar" />',
      fixedTemplate: '<SomeThing class="{{if this.lol "foo" "bar"}}" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
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
    {
      template: '<SomeThing @classNameBindings="lol:foo" />',
      fixedTemplate: '<SomeThing class="{{if this.lol "foo"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing class="always" @classNameBindings="lol:foo:bar" />',
      fixedTemplate: '<SomeThing class="always {{if this.lol "foo" "bar"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 26,
              "filePath": "layout.hbs",
              "isFixable": true,
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
    {
      template: '<SomeThing class={{"always"}} @classNameBindings="lol:foo:bar" />',
      fixedTemplate: '<SomeThing class="{{"always"}} {{if this.lol "foo" "bar"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 30,
              "filePath": "layout.hbs",
              "isFixable": true,
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
    {
      template: '<SomeThing class="always" @classNameBindings="lol:foo" />',
      fixedTemplate: '<SomeThing class="always {{if this.lol "foo"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 26,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing class="always" @classNameBindings="lol:foo other:true:false" />',
      fixedTemplate:
        '<SomeThing class="always {{if this.lol "foo"}} {{if this.other "true" "false"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 26,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo other:true:false\\"",
            },
          ]
        `);
      },
    },
    {
      template:
        '<SomeThing class="always" @classBinding="first:yep" @classNameBindings="lol:foo other:true:false" />',
      fixedTemplate:
        '<SomeThing class="always {{if this.first "yep"}} {{if this.lol "foo"}} {{if this.other "true" "false"}}" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 26,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classBinding=\\"first:yep\\"",
            },
            Object {
              "column": 52,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo other:true:false\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{some-thing classBinding="lol:wat"}}',
      fixedTemplate: '{{some-thing class=(if this.lol "wat")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
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
      template: '{{some-thing classBinding="lol:truthy:falsey"}}',
      fixedTemplate: '{{some-thing class=(if this.lol "truthy" "falsey")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{some-thing classBinding="lol:truthy:falsey other:yep:nope"}}',
      fixedTemplate:
        '{{some-thing class=(concat (if this.lol "truthy" "falsey") " " (if this.other "yep" "nope"))}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey other:yep:nope\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{some-thing class="bar" classBinding="lol:truthy:falsey"}}',
      fixedTemplate: '{{some-thing class=(concat "bar" " " (if this.lol "truthy" "falsey"))}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 25,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey\\"",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{some-thing class=(concat "foo " this.something) classBinding="lol:truthy:falsey"}}',
      fixedTemplate:
        '{{some-thing class=(concat "foo " this.something " " (if this.lol "truthy" "falsey"))}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 50,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{some-thing class="always" classBinding="lol:truthy:falsey other:yep:nope"}}',
      fixedTemplate:
        '{{some-thing class=(concat "always" " " (if this.lol "truthy" "falsey") " " (if this.other "yep" "nope"))}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 28,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`classBinding\` property as an argument within templates is not allowed.",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey other:yep:nope\\"",
            },
          ]
        `);
      },
    },
  ],
});
