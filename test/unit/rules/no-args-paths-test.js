'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-args-paths',

  config: 'true',
  good: [
    '<div @foo={{cleanup this.args}}></div>',
    '{{foo (name this.args)}}',
    '{{foo name=this.args}}',
    '{{foo name=(extract this.args)}}',
    '<Foo @params={{this.args}} />',
    '<Foo {{mod this.args}} />',
    '<Foo {{mod items=this.args}} />',
    '<Foo {{mod items=(extract this.args)}} />',
  ],
  bad: [
    {
      template: '{{hello (format value=args.foo)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo\\" usage, try \\"@foo\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{hello value=args.foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 14,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo\\" usage, try \\"@foo\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{hello (format args.foo.bar)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 16,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo.bar\\" usage, try \\"@foo.bar\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo.bar",
            },
          ]
        `);
      },
    },
    {
      template: '<br {{hello args.foo.bar}}>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo.bar\\" usage, try \\"@foo.bar\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo.bar",
            },
          ]
        `);
      },
    },
    {
      template: '{{hello args.foo.bar}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo.bar\\" usage, try \\"@foo.bar\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo.bar",
            },
          ]
        `);
      },
    },
    {
      template: '{{args.foo.bar}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo.bar\\" usage, try \\"@foo.bar\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo.bar",
            },
          ]
        `);
      },
    },
    {
      template: '{{args.foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"args.foo\\" usage, try \\"@foo\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "args.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.args.foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid \\"this.args.foo\\" usage, try \\"@foo\\" instead.",
              "rule": "no-args-paths",
              "severity": 2,
              "source": "this.args.foo",
            },
          ]
        `);
      },
    },
  ],
});
