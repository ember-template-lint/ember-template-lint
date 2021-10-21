'use strict';

const { message } = require('../../../lib/rules/no-input-block');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-input-block',

  config: true,

  good: ['{{button}}', '{{#x-button}}{{/x-button}}', '{{input}}'],

  bad: [
    {
      template: '{{#input}}{{/input}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
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
