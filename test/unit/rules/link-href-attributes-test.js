'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'link-href-attributes',

  config: true,

  good: [
    '<a href=""></a>' /* empty string is really valid! */,
    '<a href="#"></a>',
    '<a href="javascript:;"></a>',
    '<a href="http://localhost"></a>',
    '<a href={{link}}></a>',
  ],

  bad: [
    {
      template: '<a></a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "a tags must have an href attribute",
              "rule": "link-href-attributes",
              "severity": 2,
              "source": "<a></a>",
            },
          ]
        `);
      },
    },
  ],
});
