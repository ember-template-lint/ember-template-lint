'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-unbalanced-curlies');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-unbalanced-curlies',

  config: true,

  good: [
    '{foo}',
    '{{foo}}',
    '{{{foo}}}',
    '{{{foo\n}}}',
    '\\{{foo}}',
    '\\{{foo}}\\{{foo}}',
    '\\{{foo}}{{foo}}',
  ],

  bad: [
    {
      template: 'foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo}}",
            },
          ]
        `);
      },
    },
    {
      template: 'foo}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "foo}}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo}}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\n}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 1,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          }}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\n}}}\nbar',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 1,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          }}}
          bar",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\r\nbar\r\n\r\nbaz}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          bar

          baz}}}",
            },
          ]
        `);
      },
    },
    {
      template: '{foo\rbar\r\rbaz}}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Unbalanced curlies detected",
              "rule": "no-unbalanced-curlies",
              "severity": 2,
              "source": "{foo
          bar

          baz}}}",
            },
          ]
        `);
      },
    },
  ],
});
