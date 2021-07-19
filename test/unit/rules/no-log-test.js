'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-log');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-log',

  config: true,

  good: [
    '{{foo}}',
    '{{button}}',
    '{{#each this.logs as |log|}}{{log}}{{/each}}',
    '{{#let this.log as |log|}}{{log}}{{/let}}',
    '{{#let (component "my-log-component") as |log|}}{{#log}}message{{/log}}{{/let}}',
    '<Logs @logs={{this.logs}} as |log|>{{log}}</Logs>',
    '<Logs @logs={{this.logs}} as |log|><Log>{{log}}</Log></Logs>',
  ],

  bad: [
    {
      template: '{{log}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{log "Logs are best for debugging!"}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{log "Logs are best for debugging!"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#log}}Arrgh!{{/log}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{#log}}Arrgh!{{/log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#log "Foo"}}{{/log}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{#log "Foo"}}{{/log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#each this.messages as |message|}}{{log message}}{{/each}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{log message}}',
        line: 1,
        column: 36,
      },
    },
    {
      template: '{{#let this.message as |message|}}{{log message}}{{/let}}',

      result: {
        message: ERROR_MESSAGE,
        source: '{{log message}}',
        line: 1,
        column: 34,
      },
    },
    {
      template:
        '<Messages @messages={{this.messages}} as |message|>{{#log}}{{message}}{{/log}}</Messages>',

      result: {
        message: ERROR_MESSAGE,
        source: '{{#log}}{{message}}{{/log}}',
        line: 1,
        column: 51,
      },
    },
  ],
});
