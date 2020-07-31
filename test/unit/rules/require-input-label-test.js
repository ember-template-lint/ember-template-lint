'use strict';

const { ERROR_MESSAGE, ERROR_MESSAGE_MULTIPLE_LABEL } = require('../../../lib/rules/require-input-label');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-input-label',

  config: true,

  good: [
    '<label>LabelText<input /></label>',
    '<label><input />LabelText</label>',
    '<label>LabelText<Input /></label>',
    '<label><Input />LabelText</label>',
    '<label>Label Text<div><input /></div></label>', // technically okay, hopefully no one does this though
    '<input id="probablyHasLabel" />', // it's likely to have an associated label if it has an id attribute
    '<input aria-label={{labelText}} />',
    '<input aria-labelledby="someIdValue" />',
    '<div></div>',
    '<input ...attributes/>', // we are unable to correctly determine if this has a label or not, so we have to allow it
    '<Input ...attributes />',
    '<Input id="foo" />',
    '{{input id="foo"}}',
    '<label>Text here<Input /></label>',
    '<label>Text here {{input}}</label>',
    '<input id="label-input" ...attributes>',
  ],

  bad: [
    {
      template: '<div><input /></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '<input />',
      },
    },
    {
      template: '<input />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<input />',
      },
    },
    {
      template: '<input title="some title value" />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<input title="some title value" />',
      },
    },
    {
      template: '<label><input></label>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 7,
        source: '<input>',
      },
    },
    {
      template: '<div>{{input}}</div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '{{input}}',
      },
    },
    {
      template: '<Input/>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<Input/>',
      },
    },
    {
      template: '<input aria-label="first label" aria-labelledby="second label">',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 0,
        source: '<input aria-label="first label" aria-labelledby="second label">',
      },
    },
    {
      template: '<input id="label-input" aria-label="second label">',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 0,
        source: '<input id="label-input" aria-label="second label">',
      },
    },
    {
      template: '<label>Input label<input aria-label="Custom label"></label>',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 18,
        source: '<input aria-label="Custom label">',
      },
    },
  ],
});
