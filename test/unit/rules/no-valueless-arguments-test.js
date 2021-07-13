'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-valueless-arguments');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-valueless-arguments',

  config: true,

  good: [
    '<SomeComponent @array={{array}} @emptyString="" disabled />',
    `<button type="submit" disabled {{on "click" this.submit}}></button>`,
    '{{curly-component valueless array=(array 1 2 3) emptyString=""}}',
  ],

  bad: [
    {
      template: '<SomeComponent @valueless />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 15,
        source: '@valueless',
      },
    },
    {
      template: '<SomeComponent @valuelessByAccident{{this.canBeAModifier}} />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 15,
        source: '@valuelessByAccident',
      },
    },
    {
      template: '<SomeComponent @valuelessByAccident{{@canBeAModifier}} />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 15,
        source: '@valuelessByAccident',
      },
    },
  ],
});
