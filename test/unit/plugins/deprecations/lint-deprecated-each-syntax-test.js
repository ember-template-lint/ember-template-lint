'use strict';

var generateRuleTests = require('../../../helpers/rule-test-harness');
var DEPRECATION_URL = require('../../../../ext/plugins/deprecations/lint-deprecated-each-syntax').DEPRECATION_URL;

var message = 'Deprecated {{#each}} usage. See the deprecation guide at ' + DEPRECATION_URL;

generateRuleTests({
  name: 'deprecated-each-syntax',

  config: true,

  good: [
    {
      template: '{{#each posts as |post|}}{{post.name}}{{/each}}'
    }
  ],

  bad: [
    {
      template: '{{#each post in posts}}{{post.name}}{{/each}}',

      result: {
        rule: 'deprecated-each-syntax',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{#each post in posts}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{#each posts as |post|}}'
        }
      }
    },
    {
      template: '{{#each posts}}{{name}}{{/each}}',

      result: {
        rule: 'deprecated-each-syntax',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{#each posts}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{#each posts as |item|}}'
        }
      }
    }
  ]
});
