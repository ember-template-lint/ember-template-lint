import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-link-to-tagname',

  config: true,

  good: [
    '<Foo @route="routeName" @tagName="button">Link text</Foo>',
    '<LinkTo @route="routeName">Link text</LinkTo>',
    '{{#link-to "routeName"}}Link text{{/link-to}}',
    '{{#foo "routeName" tagName="button"}}Link text{{/foo}}',
    '{{link-to "Link text" "routeName"}}',
    '{{foo "Link text" "routeName" tagName="button"}}',
  ],

  bad: [
    {
      template: '<LinkTo @route="routeName" @tagName="button">Link text</LinkTo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 27,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Overriding \`tagName\` on \`LinkTo\` components is not allowed",
              "rule": "no-link-to-tagname",
              "severity": 2,
              "source": "@tagName=\\"button\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to "routeName" tagName="button"}}Link text{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 23,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Overriding \`tagName\` on \`LinkTo\` components is not allowed",
              "rule": "no-link-to-tagname",
              "severity": 2,
              "source": "tagName=\\"button\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to "Link text" "routeName" tagName="button"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 34,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Overriding \`tagName\` on \`LinkTo\` components is not allowed",
              "rule": "no-link-to-tagname",
              "severity": 2,
              "source": "tagName=\\"button\\"",
            },
          ]
        `);
      },
    },
  ],
});
