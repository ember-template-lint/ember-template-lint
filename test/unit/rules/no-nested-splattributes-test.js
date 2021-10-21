'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-nested-splattributes',

  config: true,

  good: [
    '<div>...</div>',
    '<div><div ...attributes>...</div></div>',
    '<div ...attributes>...</div>',
    '<div ...attributes>...</div><div ...attributes>...</div>',
  ],

  bad: [
    {
      template:
        '<div ...attributes>\n' +
        '  <div ...attributes>\n' +
        '    ...\n' +
        '  </div>\n' +
        '</div>\n',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 20,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Nested splattributes are not allowed",
              "rule": "no-nested-splattributes",
              "severity": 2,
              "source": "...attributes",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div ...attributes>\n' +
        '  <div>\n' +
        '    <div ...attributes>\n' +
        '    ...\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "endColumn": 22,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Nested splattributes are not allowed",
              "rule": "no-nested-splattributes",
              "severity": 2,
              "source": "...attributes",
            },
          ]
        `);
      },
    },
  ],
});
