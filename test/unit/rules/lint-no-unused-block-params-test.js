'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-unused-block-params',

  config: true,

  good: [
    '{{cat}}',
    '{{#each cats as |cat|}}{{cat}}{{/each}}',
    '{{#each cats as |cat|}}{{partial "cat"}}{{/each}}',
    '{{#each cats as |cat|}}{{cat.name}}{{/each}}',
    '{{#each cats as |cat|}}{{meow cat}}{{/each}}',
    '{{#each cats as |cat index|}}{{index}}{{/each}}',
    '{{#each cats as |cat index|}}' +
      '{{#each cat.lives as |life|}}' +
        '{{index}}: {{life}}' +
      '{{/each}}' +
    '{{/each}}',
    '{{#each cats as |cat|}}{{#meow-meow cat as |cat|}}{{cat}}{{/meow-meow}}{{/each}}',
    '{{! template-lint-disable unused-block-params}}{{#each cats as |cat|}}Dogs{{/each}}',
    '{{#with (component "foo-bar") as |FooBar|}}<FooBar />{{/with}}',
  ],

  bad: [
    {
      template: '{{#each cats as |cat|}}Dogs{{/each}}',

      result: {
        message: '\'cat\' is defined but never used',
        moduleId: 'layout.hbs',
        source: 'Dogs',
        line: 1,
        column: 23
      }
    },
    {
      template: '{{#each cats as |cat index|}}{{cat}}{{/each}}',
      result: {
        message: '\'index\' is defined but never used',
        moduleId: 'layout.hbs',
        source: '{{cat}}',
        line: 1,
        column: 29
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
        message: '\'index\' is defined but never used',
        moduleId: 'layout.hbs',
        source: '{{#each cat.lives as |life index|}}{{index}}: {{life}}{{/each}}',
        line: 1,
        column: 29
      }
    },    {
      template:
      '{{#each cats as |cat index|}}' +
        '{{partial "cat"}}' +
        '{{#each cat.lives as |life|}}Life{{/each}}' +
      '{{/each}}',
      result: {
        message: '\'life\' is defined but never used',
        moduleId: 'layout.hbs',
        source: 'Life',
        line: 1,
        column: 75,
      }
    }
  ]
});
