import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'style-concatenation',

  config: true,

  good: [
    '<img>',
    '<img style={{myStyle}}>',
    '<img style={{background-image url}}>',
    '<img style="background-image: url(/foo.png)"}}>',
    '<img style={{html-safe (concat "background-image: url(" url ")")}}>',
    '<img style={{html-safe (concat knownSafeStyle1 ";" knownSafeStyle2)}}>',
  ],

  bad: [
    {
      template: '<img style="{{myStyle}}">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Concatenated styles must be marked as \`htmlSafe\`.",
              "rule": "style-concatenation",
              "severity": 2,
              "source": "style="{{myStyle}}"",
            },
          ]
        `);
      },
    },
    {
      template: '<img style="background-image: {{url}}">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Concatenated styles must be marked as \`htmlSafe\`.",
              "rule": "style-concatenation",
              "severity": 2,
              "source": "style="background-image: {{url}}"",
            },
          ]
        `);
      },
    },
    {
      template: '<img style="{{background-image url}}">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Concatenated styles must be marked as \`htmlSafe\`.",
              "rule": "style-concatenation",
              "severity": 2,
              "source": "style="{{background-image url}}"",
            },
          ]
        `);
      },
    },
    {
      template: '<img style={{concat knownSafeStyle1 ";" knownSafeStyle2}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Concatenated styles must be marked as \`htmlSafe\`.",
              "rule": "style-concatenation",
              "severity": 2,
              "source": "style={{concat knownSafeStyle1 ";" knownSafeStyle2}}",
            },
          ]
        `);
      },
    },
  ],
});
