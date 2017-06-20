'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'linebreak-style',

  config: true,

  good: [
    'testing this',
    'testing \n this',
    {
      config: 'windows',
      template: 'testing\r\nthis'
    },
    {
      config: 'unix',
      template: 'testing\nthis'
    },
    {
      config: true,
      template: 'testing\nthis'
    },
  ],

  bad: [
    {
      template: '\r\n',

      result: {
        rule: 'linebreak-style',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used',
        line: 1,
        column: 0,
        source: '\r\n'
      }
    },
    {
      template: '{{#if test}}\r\n{{/if}}',

      result: {
        rule: 'linebreak-style',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used',
        line: 1,
        column: 12,
        source: '\r\n'
      }
    },
    {
      template: '{{blah}}\r\n{{blah}}',

      result: {
        rule: 'linebreak-style',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used',
        line: 1,
        column: 8,
        source: '\r\n'
      }
    },
    {
      template: '{{blah}}\r\n',

      result: {
        rule: 'linebreak-style',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used',
        line: 1,
        column: 8,
        source: '\r\n'
      }
    },
    {
      template: '{{blah arg="\r\n"}}',

      result: {
        rule: 'linebreak-style',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used',
        line: 1,
        column: 12,
        source: '\r\n'
      }
    },
    {
      config: 'windows',
      template: '\n',

      result: {
        rule: 'linebreak-style',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used',
        line: 1,
        column: 0,
        source: '\n'
      }
    }
  ]
});
