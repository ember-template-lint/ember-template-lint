import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-potential-path-strings',

  config: true,

  good: [
    '<img src="foo.png">',
    '<img src={{picture}}>',
    '<img src={{this.picture}}>',
    '<img src={{@img}}>',
    '<SomeComponent @foo={{@bar}} />',
  ],

  bad: [
    {
      template: '<img src="this.picture">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Potential path in attribute string detected. Did you mean {{this.picture}}?",
              "rule": "no-potential-path-strings",
              "severity": 2,
              "source": "this.picture",
            },
          ]
        `);
      },
    },
    {
      template: '<img src=this.picture>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Potential path in attribute string detected. Did you mean {{this.picture}}?",
              "rule": "no-potential-path-strings",
              "severity": 2,
              "source": "this.picture",
            },
          ]
        `);
      },
    },
    {
      template: '<img src="@img">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Potential path in attribute string detected. Did you mean {{@img}}?",
              "rule": "no-potential-path-strings",
              "severity": 2,
              "source": "@img",
            },
          ]
        `);
      },
    },
    {
      template: '<img src=@img>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Potential path in attribute string detected. Did you mean {{@img}}?",
              "rule": "no-potential-path-strings",
              "severity": 2,
              "source": "@img",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeComponent @foo=@bar />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Potential path in attribute string detected. Did you mean {{@bar}}?",
              "rule": "no-potential-path-strings",
              "severity": 2,
              "source": "@bar",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeComponent @foo=this.bar />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Potential path in attribute string detected. Did you mean {{this.bar}}?",
              "rule": "no-potential-path-strings",
              "severity": 2,
              "source": "this.bar",
            },
          ]
        `);
      },
    },
  ],
});
