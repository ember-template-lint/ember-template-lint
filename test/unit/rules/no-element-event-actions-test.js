'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-element-event-actions');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-element-event-actions',

  config: true,

  good: [
    '<button></button>',
    '<button type="button" on={{action "myAction"}}></button>',
    '<button type="button" onclick="myFunction()"></button>',
    '<button type="button" {{action "myAction"}}></button>',
    '<button type="button" value={{value}}></button>',
    '{{my-component onclick=(action "myAction") someProperty=true}}',
    '<SiteHeader @someFunction={{action "myAction"}} @user={{this.user}} />',
  ],

  bad: [
    {
      template:
        '<button onclick={{action "myAction"}} ONFOCUS={{action "myAction"}} otherProperty=true></button>',

      results: [
        {
          message: ERROR_MESSAGE,
          source: 'onclick={{action "myAction"}}',
          line: 1,
          column: 8,
        },
        {
          message: ERROR_MESSAGE,
          source: 'ONFOCUS={{action "myAction"}}',
          line: 1,
          column: 38,
        },
      ],
    },

    {
      template: '<SiteHeader onclick={{action "myAction"}} @user={{this.user}} />',

      result: {
        message: ERROR_MESSAGE,
        source: 'onclick={{action "myAction"}}',
        line: 1,
        column: 12,
      },
    },
  ],
});
