'use strict';

const generateRuleTests = require('../../../helpers/rule-test-harness');
const DEPRECATION_URL = require('../../../../lib/rules/deprecations/deprecated-each-syntax')
  .DEPRECATION_URL;

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

      result: {
        message,
        source: '{{#each post in posts}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{#each posts as |post|}}',
        },
      },
    },
    {
      template: '{{#each posts}}{{name}}{{/each}}',

      result: {
        message,
        source: '{{#each posts}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{#each posts as |item|}}',
        },
      },
    },
  ],
});
