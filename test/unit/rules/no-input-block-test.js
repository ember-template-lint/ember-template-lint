import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-input-block',

  config: true,

  good: ['{{button}}', '{{#x-button}}{{/x-button}}', '{{input}}'],

  bad: [
    {
      template: '{{#input}}{{/input}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected block usage. The {{input}} helper may only be used inline.",
              "rule": "no-input-block",
              "severity": 2,
              "source": "{{#input}}{{/input}}",
            },
          ]
        `);
      },
    },
  ],
});
