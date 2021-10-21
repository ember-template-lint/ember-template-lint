'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { errorMessage: message } = require('./../../../lib/rules/no-accesskey-attribute');

generateRuleTests({
  name: 'no-accesskey-attribute',

  config: true,

  good: ['<div></div>'],

  bad: [
    {
      template: '<button accesskey="n"></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
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
    {
      template: '<button accesskey="{{some-key}}"></button>',
      fixedTemplate: '<button></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
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
