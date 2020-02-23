'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-input-tagname').message;

generateRuleTests({
  name: 'no-input-tagname',

  config: true,

  good: [
    '{{input type="text"}}',
    '{{component "input" type="text"}}',
    '{{yield (component "input" type="text")}}',
  ],

  bad: [
    {
      template: '{{input tagName="foo"}}',

      result: {
        message,
        source: '{{input tagName="foo"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{input tagName=bar}}',

      result: {
        message,
        source: '{{input tagName=bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "input" tagName="foo"}}',

      result: {
        message,
        source: '{{component "input" tagName="foo"}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{component "input" tagName=bar}}',

      result: {
        message,
        source: '{{component "input" tagName=bar}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{yield (component "input" tagName="foo")}}',

      result: {
        message,
        source: '(component "input" tagName="foo")',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (component "input" tagName=bar)}}',

      result: {
        message,
        source: '(component "input" tagName=bar)',
        line: 1,
        column: 8,
      },
    },
  ],
});
