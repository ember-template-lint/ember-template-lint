'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/no-action-modifiers').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-action-modifiers',

  config: true,

  good: [
    '<button onclick={{action "foo"}}></button>',
    '<a href="#" onclick={{action "foo"}}></a>',
    '<div action></div>',
    '{{foo-bar (action "foo")}}',
    '{{foo-bar action}}',

    {
      config: ['button'],
      template: '<button {{action "foo"}}></button>',
    },
  ],

  bad: [
    {
      template: '<button {{action "foo"}}></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<button {{action "foo"}}></button>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<a href="#" {{action "foo"}}></a>',

      result: {
        message: ERROR_MESSAGE,
        source: '<a href="#" {{action "foo"}}></a>',
        line: 1,
        column: 12,
      },
    },
    {
      config: ['button'],
      template: '<a href="#" {{action "foo"}}></a>',

      result: {
        message: ERROR_MESSAGE,
        source: '<a href="#" {{action "foo"}}></a>',
        line: 1,
        column: 12,
      },
    },
  ],
});
