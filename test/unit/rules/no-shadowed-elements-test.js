import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-shadowed-elements',

  config: true,

  good: [
    '{{#foo-bar as |Baz|}}<Baz />{{/foo-bar}}',
    '<FooBar as |Baz|><Baz /></FooBar>',
    '{{#with foo=(component "blah-zorz") as |Div|}}<Div></Div>{{/with}}',
    '<Foo as |bar|><bar.baz /></Foo>',
  ],

  bad: [
    {
      template: '<FooBar as |div|><div></div></FooBar>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous element used (\`div\`)",
              "rule": "no-shadowed-elements",
              "severity": 2,
              "source": "<div></div>",
            },
          ]
        `);
      },
    },
  ],
});
