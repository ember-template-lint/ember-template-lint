'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-action-on-submit-button');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-action-on-submit-button',

  config: true,

  good: [
    // valid "button" type
    '<button type="button" />',
    '<button type="button" {{action "handleClick"}} />',
    '<button type="button" {{on "click" "handleClick"}} />',

    // valid "submit" type
    '<button />',
    '<button type="submit" />',

    // valid div elements
    '<div/>',
    '<div></div>',
    '<div type="submit"></div>',
    '<div type="submit" {{action "handleClick"}}></div>',
    '<div type="submit" {{on "click" "handleClick"}}></div>',
  ],

  bad: [
    {
      template: '<button {{action "handleClick"}} />',

      result: {
        message: ERROR_MESSAGE,
        source: '<button {{action "handleClick"}} />',
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button {{on "click" "handleClick"}} />',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button {{on "click" "handleClick"}} />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button type="submit" {{action "handleClick"}} />',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button type="submit" {{action "handleClick"}} />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button type="submit" {{on "click" "handleClick"}} />',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button type="submit" {{on "click" "handleClick"}} />',
        line: 1,
        column: 0,
      },
    },
  ],
});
