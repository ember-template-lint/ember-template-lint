import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unbound',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{unbound foo}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{unbound}} usage.",
              "rule": "no-unbound",
              "severity": 2,
              "source": "{{unbound foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-thing foo=(unbound foo)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{unbound}} usage.",
              "rule": "no-unbound",
              "severity": 2,
              "source": "(unbound foo)",
            },
          ]
        `);
      },
    },
  ],
});
