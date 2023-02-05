import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unnecessary-curly-braces-for-strings',

  config: true,

  good: ['class="btn"'],

  bad: [
    {
      template: '{{"btn"}}',
      fixedTemplate: '"btn"',

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
              "message": "Unnecessary curly braces around string",
              "rule": "no-unnecessary-curly-braces-for-strings",
              "severity": 2,
              "source": "{{\\"btn\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: 'class={{"btn"}}',
      fixedTemplate: 'class="btn"',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary curly braces around string",
              "rule": "no-unnecessary-curly-braces-for-strings",
              "severity": 2,
              "source": "{{\\"btn\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: 'class={{"btn"}} value={{"xyz"}}',
      fixedTemplate: 'class="btn" value="xyz"',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary curly braces around string",
              "rule": "no-unnecessary-curly-braces-for-strings",
              "severity": 2,
              "source": "{{\\"btn\\"}}",
            },
            {
              "column": 22,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Unnecessary curly braces around string",
              "rule": "no-unnecessary-curly-braces-for-strings",
              "severity": 2,
              "source": "{{\\"xyz\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
