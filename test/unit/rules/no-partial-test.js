import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-partial',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{partial "foo"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected {{partial}} usage.",
              "rule": "no-partial",
              "severity": 2,
              "source": "{{partial \\"foo\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
