'use strict';

const { generateErrorMessage } = require('../../../lib/rules/builtin-component-arguments');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'builtin-component-arguments',

  config: true,

  good: [
    '<Input/>',
    '<input type="text" size="10" />',
    '<Input @type="text" size="10" />',
    '<Input @type="checkbox" @checked={{true}} />',
    '<Textarea @value="Tomster" />',
  ],

  bad: [
    {
      template: '<Input type="text" size="10" />',
      result: {
        message: generateErrorMessage('Input', 'type'),
        line: 1,
        column: 7,
        source: 'type="text"',
      },
    },
    {
      template: '<Input @type="checkbox" checked />',
      result: {
        message: generateErrorMessage('Input', 'checked'),
        line: 1,
        column: 24,
        source: 'checked',
      },
    },
    {
      template: '<Textarea value="Tomster" />',
      result: {
        message: generateErrorMessage('Textarea', 'value'),
        line: 1,
        column: 10,
        source: 'value="Tomster"',
      },
    },
  ],
});
