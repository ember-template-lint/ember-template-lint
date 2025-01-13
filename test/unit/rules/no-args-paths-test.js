import generateRuleTests from '../../helpers/rule-test-harness.js';

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
          [
            {
              "column": 22,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo" usage, try "@foo" instead.",
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
          [
            {
              "column": 14,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo" usage, try "@foo" instead.",
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
          [
            {
              "column": 16,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.",
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
          [
            {
              "column": 12,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.",
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
          [
            {
              "column": 8,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.",
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
          [
            {
              "column": 2,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.",
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
          [
            {
              "column": 2,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "args.foo" usage, try "@foo" instead.",
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
          [
            {
              "column": 2,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Component templates should avoid "this.args.foo" usage, try "@foo" instead.",
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
