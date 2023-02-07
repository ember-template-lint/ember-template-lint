import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unnecessary-curly-parens',

  config: true,

  good: ['{{foo}}', '{{concat "a" "b"}}', '{{concat (capitalize "foo") "-bar"}}'],

  bad: [
    {
      template: '{{(foo)}}',
      fixedTemplate: '{{foo}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary parentheses enclosing statement",
              "rule": "no-unnecessary-curly-parens",
              "severity": 2,
              "source": "{{(foo)}}",
            },
          ]
        `);
      },
    },

    {
      template: '{{(concat "a" "b")}}',
      fixedTemplate: '{{concat "a" "b"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary parentheses enclosing statement",
              "rule": "no-unnecessary-curly-parens",
              "severity": 2,
              "source": "{{(concat \\"a\\" \\"b\\")}}",
            },
          ]
        `);
      },
    },

    {
      template: '{{((concat "a" "b"))}}',
      fixedTemplate: '{{concat "a" "b"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary parentheses enclosing statement",
              "rule": "no-unnecessary-curly-parens",
              "severity": 2,
              "source": "{{((concat \\"a\\" \\"b\\"))}}",
            },
          ]
        `);
      },
    },
  ],
});
