'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/require-button-type');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-button-type',

  config: true,

  good: [
    // valid static values
    '<button type="button" />',
    '<button type="button">label</button>',
    '<button type="submit" />',
    '<button type="reset" />',

    // dynamic values
    '<button type="{{buttonType}}" />',
    '<button type={{buttonType}} />',

    '<div/>',
    '<div></div>',
    '<div type="randomType"></div>',
  ],

  bad: [
    {
      template: '<button/>',
      fixedTemplate: '<button type="button" />',

      result: {
        message: ERROR_MESSAGE,
        source: '<button/>',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: '<button>label</button>',
      fixedTemplate: '<button type="button">label</button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<button>label</button>',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: '<button type="" />',
      fixedTemplate: '<button type="button" />',

      result: {
        message: ERROR_MESSAGE,
        source: '<button type="" />',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: '<button type="foo" />',
      fixedTemplate: '<button type="button" />',

      result: {
        message: ERROR_MESSAGE,
        source: '<button type="foo" />',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: '<button type=42 />',
      fixedTemplate: '<button type="button" />',

      result: {
        message: ERROR_MESSAGE,
        source: '<button type=42 />',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
  ],
});
