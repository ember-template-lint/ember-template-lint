'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/require-input-label').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-input-label',

  config: true,

  good: [
    '<label>LabelText<input /></label>',
    '<label><input />LabelText</label>',
    '<label>LabelText<Input /></label>',
    '<label><Input />LabelText</label>',
    '<input id="probablyHasLabel" />', // it's likely to have an associated label if it has an id attribute
    '<input aria-label={{labelText}} />',
    '<input aria-labelledby="someIdValue" />',
  ],

  bad: [
    {
      template: '<div><input /></div>',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '<input />',
      },
    },
  ],
});
