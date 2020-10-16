'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { errorMessage: message } = require('./../../../lib/rules/no-accesskey-attribute');

generateRuleTests({
  name: 'no-accesskey-attribute',

  config: true,

  good: ['<div></div>'],

  bad: [
    {
      template: '<button accesskey="n"></button>',
      result: {
        message,
        source: 'accesskey="n"',
        isFixable: true,
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button accesskey></button>',
      result: {
        message,
        source: 'accesskey',
        isFixable: true,
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button accesskey={{some-key}}></button>',
      result: {
        message,
        source: 'accesskey={{some-key}}',
        isFixable: true,
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button accesskey="{{some-key}}"></button>',
      result: {
        message,
        source: 'accesskey="{{some-key}}"',
        line: 1,
        column: 8,
        isFixable: true,
      },
    },
    {
      template: '<button accesskey="{{some-key}}"></button>',
      fixedTemplate: '<button></button>',
      result: {
        message,
        line: 1,
        column: 8,
        source: 'accesskey="{{some-key}}"',
        isFixable: true,
      },
    },
  ],
});
