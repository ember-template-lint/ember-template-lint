'use strict';

const {
  ERROR_MESSAGE,
  ERROR_MESSAGE_MULTIPLE_LABEL,
} = require('../../../lib/rules/require-input-label');
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

    // Same logic applies to textareas
    '<label>LabelText<textarea /></label>',
    '<label><textarea />LabelText</label>',
    '<label>LabelText<Textarea /></label>',
    '<label><Textarea />LabelText</label>',
    '<label>Label Text<div><textarea /></div></label>', // technically okay, hopefully no one does this though
    '<textarea id="probablyHasLabel" />', // it's likely to have an associated label if it has an id attribute
    '<textarea aria-label={{labelText}} />',
    '<textarea aria-labelledby="someIdValue" />',
    '<textarea ...attributes/>', // we are unable to correctly determine if this has a label or not, so we have to allow it
    '<Textarea ...attributes />',
    '<Textarea id="foo" />',
    '{{textarea id="foo"}}',
    '<label>Text here<Textarea /></label>',
    '<label>Text here {{textarea}}</label>',
    '<textarea id="label-input" ...attributes />',

    // Same logic applies to select menus
    '<label>LabelText<select></select></label>',
    '<label><select></select>LabelText</label>',
    '<label>Label Text<div><select></select></div></label>', // technically okay, hopefully no one does this though
    '<select id="probablyHasLabel" ></select>', // it's likely to have an associated label if it has an id attribute
    '<select aria-label={{labelText}} ></select>',
    '<select aria-labelledby="someIdValue" ></select>',
    '<select ...attributes></select>', // we are unable to correctly determine if this has a label or not, so we have to allow it
    '<select id="label-input" ...attributes ></select>',

    // Hidden inputs are allowed.
    '<input type="hidden"/>',
    '<Input type="hidden" />',
    '{{input type="hidden"}}',
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
    {
      template: '{{input type="button"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{input type="button"}}',
      },
    },
    {
      template: '{{input type=myType}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{input type=myType}}',
      },
    },
    {
      template: '<input type="button"/>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<input type="button"/>',
      },
    },
    {
      template: '<input type={{myType}}/>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<input type={{myType}}/>',
      },
    },
    {
      template: '<Input type="button"/>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<Input type="button"/>',
      },
    },
    {
      template: '<Input type={{myType}}/>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<Input type={{myType}}/>',
      },
    },
    {
      template: '<div><textarea /></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '<textarea />',
      },
    },
    {
      template: '<textarea />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<textarea />',
      },
    },
    {
      template: '<textarea title="some title value" />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<textarea title="some title value" />',
      },
    },
    {
      template: '<label><textarea /></label>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 7,
        source: '<textarea />',
      },
    },
    {
      template: '<div>{{textarea}}</div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '{{textarea}}',
      },
    },
    {
      template: '<Textarea />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<Textarea />',
      },
    },
    {
      template: '<textarea aria-label="first label" aria-labelledby="second label" />',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 0,
        source: '<textarea aria-label="first label" aria-labelledby="second label" />',
      },
    },
    {
      template: '<textarea id="label-input" aria-label="second label" />',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 0,
        source: '<textarea id="label-input" aria-label="second label" />',
      },
    },
    {
      template: '<label>Textarea label<textarea aria-label="Custom label" /></label>',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 21,
        source: '<textarea aria-label="Custom label" />',
      },
    },
    {
      template: '<div><select></select></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '<select></select>',
      },
    },
    {
      template: '<select></select>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<select></select>',
      },
    },
    {
      template: '<select title="some title value" />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<select title="some title value" />',
      },
    },
    {
      template: '<label><select></select></label>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 7,
        source: '<select></select>',
      },
    },
    {
      template: '<select aria-label="first label" aria-labelledby="second label" />',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 0,
        source: '<select aria-label="first label" aria-labelledby="second label" />',
      },
    },
    {
      template: '<select id="label-input" aria-label="second label" />',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 0,
        source: '<select id="label-input" aria-label="second label" />',
      },
    },
    {
      template: '<label>Select label<select aria-label="Custom label" /></label>',
      result: {
        message: ERROR_MESSAGE_MULTIPLE_LABEL,
        line: 1,
        column: 19,
        source: '<select aria-label="Custom label" />',
      },
    },
  ],
});
