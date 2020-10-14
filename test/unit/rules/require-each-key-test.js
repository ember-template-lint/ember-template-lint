'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/require-each-key');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-each-key',

  config: true,

  good: [
    '{{#each this.items key="id" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="deeply.nested.id" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="@index" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
    '{{#if foo}}{{/if}}',
  ],

  bad: [
    {
      template: '{{#each this.items as |item|}} {{item.name}} {{/each}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{#each this.items as |item|}} {{item.name}} {{/each}}',
      },
    },
    {
      template: '{{#each this.items key="@invalid" as |item|}} {{item.name}} {{/each}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{#each this.items key="@invalid" as |item|}} {{item.name}} {{/each}}',
      },
    },
    {
      template: '{{#each this.items key="" as |item|}} {{item.name}} {{/each}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{#each this.items key="" as |item|}} {{item.name}} {{/each}}',
      },
    },
  ],
});
