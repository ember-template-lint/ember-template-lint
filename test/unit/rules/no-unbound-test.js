'use strict';

const { message } = require('../../../lib/rules/no-unbound');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
