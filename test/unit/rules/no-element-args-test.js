'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/no-element-args').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-element-args',

  config: true,

  good: [
    '<button></button>',
    '<button type="button" on={{action "myAction"}}></button>',
    '<button type="button" onclick="myFunction()"></button>',
    '<button type="button" {{action "myAction"}}></button>',
    '<button type="button" value={{value}}></button>',
    '{{my-component onclick=(action "myAction") someProperty=true}}',
    '<SiteHeader @someFunction={{action "myAction"}} @user={{this.user}}/>',
  ],

  bad: [
    {
      template: '<button @hello="world">My button</button>',
      result: {
        message: ERROR_MESSAGE,
        source: '@hello="world"',
        line: 1,
        column: 8,
      },
    },

    {
      template: '<input @value="my-value"/>',
      result: {
        message: ERROR_MESSAGE,
        source: '@value="my-value"',
        line: 1,
        column: 7,
      },
    },

    {
      template: '<a @href="http://example.com" @target="_blank"/>',
      results: [
        {
          message: ERROR_MESSAGE,
          source: '@href="http://example.com"',
          line: 1,
          column: 3,
        },
        {
          message: ERROR_MESSAGE,
          source: '@target="_blank"',
          line: 1,
          column: 30,
        },
      ],
    },
  ],
});
