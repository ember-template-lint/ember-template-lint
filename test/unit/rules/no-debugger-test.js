import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-debugger',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{debugger}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 12,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{debugger}} usage.",
              "rule": "no-debugger",
              "severity": 2,
              "source": "{{debugger}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#debugger}}Invalid!{{/debugger}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{debugger}} usage.",
              "rule": "no-debugger",
              "severity": 2,
              "source": "{{#debugger}}Invalid!{{/debugger}}",
            },
          ]
        `);
      },
    },
  ],
});
