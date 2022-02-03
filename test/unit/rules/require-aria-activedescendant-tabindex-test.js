import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-aria-activedescendant-tabindex',

  config: true,

  good: [
    '<div tabindex="-1"></div>',
    '<input aria-activedescendant="some-id" />',
    '<input aria-activedescendant={{foo}} tabindex={{0}} />',
    '<div aria-activedescendant="option0" tabindex="0"></div>',
    '<CustomComponent aria-activedescendant="choice1" />',
    '<CustomComponent aria-activedescendant="option1" tabIndex="-1" />',
    '<CustomComponent aria-activedescendant={{foo}} tabindex={{bar}} />',
  ],
  bad: [
    {
      template: '<input aria-activedescendant="option0" tabindex="-2" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 55,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "An element using the aria-activedescendant attribute must have a tabindex of zero",
              "rule": "require-aria-activedescendant-tabindex",
              "severity": 2,
              "source": "<input aria-activedescendant=\\"option0\\" tabindex=\\"-2\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<input aria-activedescendant="select" tabindex="2" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "An element using the aria-activedescendant attribute must have a tabindex of zero",
              "rule": "require-aria-activedescendant-tabindex",
              "severity": 2,
              "source": "<input aria-activedescendant=\\"select\\" tabindex=\\"2\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<div aria-activedescendant="fixme" tabindex="500"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 56,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "An element using the aria-activedescendant attribute must have a tabindex of zero",
              "rule": "require-aria-activedescendant-tabindex",
              "severity": 2,
              "source": "<div aria-activedescendant=\\"fixme\\" tabindex=\\"500\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div aria-activedescendant={{bar}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "An element using the aria-activedescendant attribute must have a tabindex of zero",
              "rule": "require-aria-activedescendant-tabindex",
              "severity": 2,
              "source": "<div aria-activedescendant={{bar}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<div aria-activedescendant={{foo}} tabindex={{-1}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "An element using the aria-activedescendant attribute must have a tabindex of zero",
              "rule": "require-aria-activedescendant-tabindex",
              "severity": 2,
              "source": "<div aria-activedescendant={{foo}} tabindex={{-1}}></div>",
            },
          ]
        `);
      },
    },
  ],
});
