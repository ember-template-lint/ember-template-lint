import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unbalanced-curlies',

  config: true,

  good: [
    '{foo}',
    '{{foo}}',
    '{{{foo}}}',
    '{{{foo\n}}}',
    '\\{{foo}}',
    '\\{{foo}}\\{{foo}}',
    '\\{{foo}}{{foo}}',
    '\\{{foo\n}}',
  ],

  bad: [
    {
      template: 'foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 4,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo}}",
            },
          ]
        `);
      },
    },
    {
      template: 'foo}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "foo}}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 4,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo}}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\n}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 3,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          }}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\n}}}\nbar',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 3,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          }}}
          bar",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\r\nbar\r\n\r\nbaz}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 4,
              "endColumn": 6,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          bar

          baz}}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\rbar\r\rbaz}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 4,
              "endColumn": 6,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          bar

          baz}}}",
            },
          ]
        `);
      },
    },
  ],
});
