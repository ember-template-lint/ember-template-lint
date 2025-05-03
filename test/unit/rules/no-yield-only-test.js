import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-yield-only',

  config: true,

  good: [
    '{{yield (hash someProp=someValue)}}',
    '{{field}}',
    '{{#yield}}{{/yield}}',
    '<Yield/>',
    '<yield/>',
    '{{! template-lint-disable no-yield-only }}{{yield}}',
  ],

  bad: [
    {
      template: '{{yield}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "{{yield}}-only templates are not allowed",
              "rule": "no-yield-only",
              "severity": 2,
              "source": "{{yield}}",
            },
          ]
        `);
      },
    },
    {
      template: '     {{yield}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "{{yield}}-only templates are not allowed",
              "rule": "no-yield-only",
              "severity": 2,
              "source": "{{yield}}",
            },
          ]
        `);
      },
    },
    {
      template: '\n  {{yield}}\n     ',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 11,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "{{yield}}-only templates are not allowed",
              "rule": "no-yield-only",
              "severity": 2,
              "source": "{{yield}}",
            },
          ]
        `);
      },
    },
    {
      template: '\n{{! some comment }}  {{yield}}\n     ',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 30,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "{{yield}}-only templates are not allowed",
              "rule": "no-yield-only",
              "severity": 2,
              "source": "{{yield}}",
            },
          ]
        `);
      },
    },
  ],
});
