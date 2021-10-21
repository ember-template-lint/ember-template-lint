'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'splat-attributes-only',

  config: true,

  good: [
    '<div ...attributes></div>',
    '<div attributes></div>',
    '<div arguments></div>',
    '<div><div ...attributes></div></div>',
  ],

  bad: [
    {
      template: '<div ...arguments></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Only \`...attributes\` can be applied to elements",
              "rule": "splat-attributes-only",
              "severity": 2,
              "source": "...arguments",
            },
          ]
        `);
      },
    },
  ],
});
