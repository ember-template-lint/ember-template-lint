'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/require-lang-attribute');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-lang-attribute',

  config: true,

  good: ['<html lang="en"></html>', '<html lang="en-US"></html>', '<html lang={{lang}}></html>'],

  bad: [
    {
      template: '<html></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The \`<html>\` element must have the \`lang\` attribute with a non-null value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html lang=""></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The \`<html>\` element must have the \`lang\` attribute with a non-null value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html lang=\\"\\"></html>",
            },
          ]
        `);
      },
    },
  ],
});
