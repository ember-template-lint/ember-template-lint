'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-log').message;

generateRuleTests({
  name: 'no-log',

  config: true,

  good: ['{{foo}}', '{{button}}'],

  bad: [
    {
      template: '{{log}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '{{log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{log "Logs are best for debugging!"}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '{{log "Logs are best for debugging!"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#log}}Arrgh!{{/log}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '{{#log}}Arrgh!{{/log}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#log "Foo"}}{{/log}}',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '{{#log "Foo"}}{{/log}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
