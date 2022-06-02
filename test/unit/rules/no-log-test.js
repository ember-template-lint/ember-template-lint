import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-log',

  config: true,

  good: [
    '{{foo}}',
    '{{button}}',
    '{{#each this.logs as |log|}}{{log}}{{/each}}',
    '{{#let this.log as |log|}}{{log}}{{/let}}',
    '{{#let (component "my-log-component") as |log|}}{{#log}}message{{/log}}{{/let}}',
    '<Logs @logs={{this.logs}} as |log|>{{log}}</Logs>',
    '<Logs @logs={{this.logs}} as |log|><Log>{{log}}</Log></Logs>',
  ],

  bad: [
    {
      template: '{{log}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{log}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{log "Logs are best for debugging!"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{log \\"Logs are best for debugging!\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#log}}Arrgh!{{/log}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{#log}}Arrgh!{{/log}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#log "Foo"}}{{/log}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{#log \\"Foo\\"}}{{/log}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#each this.messages as |message|}}{{log message}}{{/each}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 36,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{log message}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#let this.message as |message|}}{{log message}}{{/let}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 49,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{log message}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '<Messages @messages={{this.messages}} as |message|>{{#log}}{{message}}{{/log}}</Messages>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 51,
              "endColumn": 78,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{log}} usage.",
              "rule": "no-log",
              "severity": 2,
              "source": "{{#log}}{{message}}{{/log}}",
            },
          ]
        `);
      },
    },
  ],
});
