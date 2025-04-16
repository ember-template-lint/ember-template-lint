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
      template: '<FooBar @x="{{index}}X{{(someHelper foo)}}" />',
      fixedTemplate: '<FooBar @x="{{index}}X{{someHelper foo}}" />',
    },
    {
      template: '<FooBar @x="{{index}}XY{{(someHelper foo)}}" />',
      fixedTemplate: '<FooBar @x="{{index}}XY{{someHelper foo}}" />',
    },
    {
      template: '<FooBar @x="{{index}}--{{(someHelper foo)}}" />',
      fixedTemplate: '<FooBar @x="{{index}}--{{someHelper foo}}" />',
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
              "source": "{{(concat "a" "b")}}",
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
              "source": "{{(helper a="b")}}",
            },
          ]
        `);
      },
    },
  ],
});
