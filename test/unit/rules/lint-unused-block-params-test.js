'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'unused-block-params',

  config: true,

  good: [
    '{{cat}}',
    '{{#each cats as |cat|}}{{cat}}{{/each}}',
    '{{#each cats as |cat|}}{{cat.name}}{{/each}}',
    '{{#each cats as |cat|}}{{meow cat}}{{/each}}',
    '{{#each cats as |cat index|}}{{index}}{{/each}}',
    '{{#each cats as |cat index|}}' +
      '{{#each cat.lives as |life|}}' +
        '{{index}}: {{life}}' +
      '{{/each}}' +
    '{{/each}}'
  ],

  bad: [
    {
      template: '{{#each cats as |cat|}}Dogs{{/each}}',

      result: {
        rule: 'unused-block-params',
        message: '\'cat\' is defined but never used',
        moduleId: 'layout.hbs',
        source: '{{#each cats as |cat|}}Dogs',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{#each cats as |cat index|}}{{cat}}{{/each}}',
      result: {
        rule: 'unused-block-params',
        message: '\'index\' is defined but never used',
        moduleId: 'layout.hbs',
        source: '{{#each cats as |cat index|}}{{cat}}',
        line: 1,
        column: 0
      }
    },
    {
      template:
        '{{#each cats as |cat index|}}' +
          '{{#each cat.lives as |life index|}}' +
            '{{index}}: {{life}}' +
          '{{/each}}' +
        '{{/each}}',
      result: {
        rule: 'unused-block-params',
        message: '\'index\' is defined but never used',
        moduleId: 'layout.hbs',
        source: '{{#each cats as |cat index|}}{{#each cat.lives as |life index|}}{{index}}: {{life}}{{/each}}',
        line: 1,
        column: 0
      }
    }
  ]
});
