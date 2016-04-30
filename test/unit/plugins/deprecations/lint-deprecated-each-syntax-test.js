'use strict';

var generateRuleTests = require('../../../helpers/rule-test-harness');

generateRuleTests({
  name: 'deprecated-each-syntax',

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
        message: 'Deprecated {{#each}} usage \nActual: {{#each post in posts}}\nExpected (rewrite the template to this): {{#each posts as |post|}}\nThe `#each in` syntax was deprecated in 1.11 and removed in Ember 2.0.\nSee the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code',
        moduleId: 'layout.hbs',
        source: '{{#each post in posts}}{{post.name}}{{/each}}',
        line: 1,
        column: 0
      }
    }
  ]
});
