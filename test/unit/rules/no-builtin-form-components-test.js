import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-builtin-form-components',

  config: true,

  good: [
    '<input type="text" />',
    '<input type="checkbox" />',
    '<input type="radio" />',
    '<textarea></textarea>',
  ],

  bad: [
    {
      template: '<Input />',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(`
          {
            "results": [
              {
                "column": 0,
                "endColumn": 9,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`Input\` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.",
                "rule": "no-builtin-form-components",
                "severity": 2,
                "source": "<Input />",
              },
            ],
          }
        `);
      },
    },
    {
      template: '<Textarea></Textarea>',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(`
          {
            "results": [
              {
                "column": 0,
                "endColumn": 21,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`Textarea\` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.",
                "rule": "no-builtin-form-components",
                "severity": 2,
                "source": "<Textarea></Textarea>",
              },
            ],
          }
        `);
      },
    },
  ],
});
