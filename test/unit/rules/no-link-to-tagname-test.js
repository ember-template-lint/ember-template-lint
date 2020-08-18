'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-link-to-tagname');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-link-to-tagname',

  config: true,

  good: [
    '<Foo @route="routeName" @tagName="button">Link text</Foo>',
    '<LinkTo @route="routeName">Link text</LinkTo>',
    '{{#link-to "routeName"}}Link text{{/link-to}}',
    '{{#foo "routeName" tagName="button"}}Link text{{/foo}}',
    '{{link-to "Link text" "routeName"}}',
    '{{foo "Link text" "routeName" tagName="button"}}',
  ],

  bad: [
    {
      template: '<LinkTo @route="routeName" @tagName="button">Link text</LinkTo>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: '@tagName="button"',
      },
    },
    {
      template: '{{#link-to "routeName" tagName="button"}}Link text{{/link-to}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 23,
        source: 'tagName="button"',
      },
    },
    {
      template: '{{link-to "Link text" "routeName" tagName="button"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: 'tagName="button"',
      },
    },
  ],
});
