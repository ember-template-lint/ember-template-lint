'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-partial',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{partial "foo"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
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
