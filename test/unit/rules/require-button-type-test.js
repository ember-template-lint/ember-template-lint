'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { ERROR_MESSAGE } = require('../../../lib/rules/require-button-type');

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

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button/>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button>label</button>',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button>label</button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button type="" />',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button type="" />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button type="foo" />',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button type="foo" />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button type=42 />',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button type=42 />',
        line: 1,
        column: 0,
      },
    },
  ],
});
