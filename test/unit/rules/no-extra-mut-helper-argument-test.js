'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/no-extra-mut-helper-argument').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-extra-mut-helper-argument',

  config: true,

  good: [
    '{{my-component click=(action (mut isClicked))}}',
    '{{my-component click=(action (mut isClicked) true)}}',
    '{{my-component isClickedMutable=(mut isClicked)}}',
    '<button {{action (mut isClicked)}}></button>',
    '<button {{action (mut isClicked) true}}></button>',
  ],

  bad: [
    {
      template: '{{my-component click=(action (mut isClicked true))}}',

      result: {
        message: ERROR_MESSAGE,
        source: '(mut isClicked true)',
        line: 1,
        column: 29,
      },
    },
    {
      template: '{{my-component isClickedMutable=(mut isClicked true)}}',

      result: {
        message: ERROR_MESSAGE,
        source: '(mut isClicked true)',
        line: 1,
        column: 32,
      },
    },
    {
      template: '<button {{action (mut isClicked true)}}></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '(mut isClicked true)',
        line: 1,
        column: 17,
      },
    },
  ],
});
