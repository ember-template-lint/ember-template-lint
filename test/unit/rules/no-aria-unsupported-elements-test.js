import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-aria-unsupported-elements',

  config: true,

  good: [
    '<meta charset="UTF-8" />',
    '<html lang="en"></html>',
    '<script></script>',
    '<div></div>',
    '<div aria-foo="true"></div>',
    '<div role="foo"></div>',
  ],

  bad: [
    {
      template: '<meta charset="UTF-8" aria-hidden="false" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The <meta> element does not support the use of ARIA roles, states, and properties such as "aria-hidden"",
              "rule": "no-aria-unsupported-elements",
              "severity": 2,
              "source": "<meta charset="UTF-8" aria-hidden="false" />",
            },
          ]
        `);
      },
    },
    {
      template: '<html lang="en" role="application"></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The <html> element does not support the use of ARIA roles, states, and properties such as "role"",
              "rule": "no-aria-unsupported-elements",
              "severity": 2,
              "source": "<html lang="en" role="application"></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<script aria-hidden="false"></script>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The <script> element does not support the use of ARIA roles, states, and properties such as "aria-hidden"",
              "rule": "no-aria-unsupported-elements",
              "severity": 2,
              "source": "<script aria-hidden="false"></script>",
            },
          ]
        `);
      },
    },
  ],
});
