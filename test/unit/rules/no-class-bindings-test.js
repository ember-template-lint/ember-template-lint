'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { ruleURL } = require('./../../../lib/rules/base');

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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:wat\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classBinding=\\"lol:wat\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classNameBindings=\\"lol:foo:bar\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo:bar\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings={{@something}}",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"isTruthy\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo:bar\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo:bar\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo:bar\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo other:true:false\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classBinding=\\"first:yep\\"",
              "url": "${ruleURL('no-class-bindings')}",
            },
            Object {
              "column": 52,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Passing the \`@classNameBindings\` property as an argument within templates is not allowed.",
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "@classNameBindings=\\"lol:foo other:true:false\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:wat\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey other:yep:nope\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey\\"",
              "url": "${ruleURL('no-class-bindings')}",
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
              "moduleId": "layout",
              "rule": "no-class-bindings",
              "severity": 2,
              "source": "classBinding=\\"lol:truthy:falsey other:yep:nope\\"",
              "url": "${ruleURL('no-class-bindings')}",
            },
          ]
        `);
      },
    },
  ],
});
