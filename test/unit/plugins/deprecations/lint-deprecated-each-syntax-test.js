'use strict';

var generateRuleTests = require('../../../helpers/rule-test-harness');

var DEPRECATION_URL = 'http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code';

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
      message: [
        "Deprecated {{#each}} usage at ('layout.hbs'@ L1:C0)",
        'Actual: {{#each post in posts}}',
        'Expected (Rewrite the template to this): ' + '{{#each posts as |post|}}',
        'The `#each in` syntax was deprecated in 1.11 and removed in 2.0.',
        'See the deprecation guide at ' + DEPRECATION_URL
      ].join('\n')
    }
  ]
});

