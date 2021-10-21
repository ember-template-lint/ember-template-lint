'use strict';

const { DEPRECATION_URL } = require('../../../lib/rules/deprecated-each-syntax');
const generateRuleTests = require('../../helpers/rule-test-harness');

const message = `Deprecated {{#each}} usage. See the deprecation guide at ${DEPRECATION_URL}`;

generateRuleTests({
  name: 'deprecated-each-syntax',

  config: true,

  good: [
    {
      template: '{{#each posts as |post|}}{{post.name}}{{/each}}',
    },
  ],

  bad: [
    {
      template: '{{#each post in posts}}{{post.name}}{{/each}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{#each posts as |post|}}",
              },
              "line": 1,
              "message": "Deprecated {{#each}} usage. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code",
              "rule": "deprecated-each-syntax",
              "severity": 2,
              "source": "{{#each post in posts}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#each posts}}{{name}}{{/each}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{#each posts as |item|}}",
              },
              "line": 1,
              "message": "Deprecated {{#each}} usage. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code",
              "rule": "deprecated-each-syntax",
              "severity": 2,
              "source": "{{#each posts}}",
            },
          ]
        `);
      },
    },
  ],
});
