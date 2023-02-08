import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unnecessary-curly-parens',

  config: true,

  good: [
    '{{foo}}',
    '{{this.foo}}',
    '{{(helper)}}',
    '{{(this.helper)}}',
    '{{concat "a" "b"}}',
    '{{concat (capitalize "foo") "-bar"}}',
  ],

  bad: [
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
      template: '{{(helper a="b")}}',
      fixedTemplate: '{{helper a="b"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary parentheses enclosing statement",
              "rule": "no-unnecessary-curly-parens",
              "severity": 2,
              "source": "{{(helper a=\\"b\\")}}",
            },
          ]
        `);
      },
    },
  ],
});
