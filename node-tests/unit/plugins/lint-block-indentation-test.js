'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'block-indentation',

  good: [
    '\n  {{#each cats as |dog|}}\n  {{/each}}'
  ],

  bad: [
    {
      template: '\n  {{#each cats as |dog|}}  {{/each}}',

      message: "Incorrect `each` block indention at beginning at ('layout.hbs'@ L2:C2)"
    }
  ]
});
