'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { errorMessage: message } = require('./../../../lib/rules/no-accesskey-attribute');

generateRuleTests({
  name: 'no-access-key',

  config: true,

  good: ['<div></div>'],

  bad: [
    {
      template: '<button accesskey="n"></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey="n"></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button accesskey></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button accesskey={{some-key}}></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey={{some-key}}></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button accesskey="{{some-key}}"></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey="{{some-key}}"></button>',
        line: 1,
        column: 0,
      },
    },
  ],
});
