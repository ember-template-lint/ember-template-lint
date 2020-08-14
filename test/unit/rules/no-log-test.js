'use strict';

const { message } = require('../../../lib/rules/no-log');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-log',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{log}}',

      result: {
        message,
        source: '{{log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{log "Logs are best for debugging!"}}',

      result: {
        message,
        source: '{{log "Logs are best for debugging!"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#log}}Arrgh!{{/log}}',

      result: {
        message,
        source: '{{#log}}Arrgh!{{/log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#log "Foo"}}{{/log}}',

      result: {
        message,
        source: '{{#log "Foo"}}{{/log}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
