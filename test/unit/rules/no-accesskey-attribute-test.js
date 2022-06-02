import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-accesskey-attribute',

  config: true,

  good: ['<div></div>'],

  bad: [
    {
      template: '<button accesskey="n"></button>',
      fixedTemplate: '<button></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.",
              "rule": "no-accesskey-attribute",
              "severity": 2,
              "source": "accesskey=\\"n\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button accesskey></button>',
      fixedTemplate: '<button></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.",
              "rule": "no-accesskey-attribute",
              "severity": 2,
              "source": "accesskey",
            },
          ]
        `);
      },
    },
    {
      template: '<button accesskey={{some-key}}></button>',
      fixedTemplate: '<button></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.",
              "rule": "no-accesskey-attribute",
              "severity": 2,
              "source": "accesskey={{some-key}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button accesskey="{{some-key}}"></button>',
      fixedTemplate: '<button></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.",
              "rule": "no-accesskey-attribute",
              "severity": 2,
              "source": "accesskey=\\"{{some-key}}\\"",
            },
          ]
        `);
      },
    },
  ],
});
