import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-aria-hidden-body',

  config: true,

  good: [
    '<body></body>',
    '<body><h1>Hello world</h1></body>',
    '<body><p aria-hidden="true">Some things are better left unsaid</p></body>',
  ],

  bad: [
    {
      template: '<body aria-hidden="true"></body>',
      fixedTemplate: '<body></body>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The aria-hidden attribute should never be present on the <body> element, as it hides the entire document from assistive technology",
              "rule": "no-aria-hidden-body",
              "severity": 2,
              "source": "<body aria-hidden=\\"true\\"></body>",
            },
          ]
        `);
      },
    },
    {
      template: '<body aria-hidden></body>',
      fixedTemplate: '<body></body>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The aria-hidden attribute should never be present on the <body> element, as it hides the entire document from assistive technology",
              "rule": "no-aria-hidden-body",
              "severity": 2,
              "source": "<body aria-hidden></body>",
            },
          ]
        `);
      },
    },
  ],
});
