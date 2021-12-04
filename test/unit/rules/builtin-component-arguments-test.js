import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'builtin-component-arguments',

  config: true,

  good: [
    '<Input/>',
    '<input type="text" size="10" />',
    '<Input @type="text" size="10" />',
    '<Input @type="checkbox" @checked={{true}} />',
    '<Textarea @value="Tomster" />',
  ],

  bad: [
    {
      template: '<Input type="text" size="10" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Setting the \`type\` attribute on the builtin <Input> component is not allowed. Did you mean \`@type\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "type=\\"text\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<Input @type="checkbox" checked />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 24,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Setting the \`checked\` attribute on the builtin <Input> component is not allowed. Did you mean \`@checked\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "checked",
            },
          ]
        `);
      },
    },
    {
      template: '<Textarea value="Tomster" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Setting the \`value\` attribute on the builtin <Textarea> component is not allowed. Did you mean \`@value\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "value=\\"Tomster\\"",
            },
          ]
        `);
      },
    },
  ],
});
