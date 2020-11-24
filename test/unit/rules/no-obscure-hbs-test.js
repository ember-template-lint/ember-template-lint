'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-obscure-hbs');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-obscure-hbs',

  config: true,

  good: [
    "{{foo bar=(get this.list '0' )}}",
    "<Foo @bar={{get this.list '0'}}",
    "{{get this.list '0'}}",
    '{{foo bar @list}}',
    'Just a regular text in the template bar.[1] bar.1',
    '<Foo foo="bar.[1]" />',
  ],

  bad: [
    {
      template: '{{foo bar=this.list.[0]}}',
      result: {
        message: ERROR_MESSAGE('this.list.0'),
        line: 1,
        column: 10,
        source: 'this.list.0',
      },
    },
    {
      template: '{{foo bar @list.[1]}}',
      result: {
        message: ERROR_MESSAGE('@list.1'),
        line: 1,
        column: 10,
        source: '@list.1',
      },
    },
    {
      template: '{{this.list.[0]}}',
      result: {
        message: ERROR_MESSAGE('this.list.0'),
        line: 1,
        column: 2,
        source: 'this.list.0',
      },
    },
    {
      template: '{{this.list.[0].name}}',
      result: {
        message: ERROR_MESSAGE('this.list.0.name'),
        line: 1,
        column: 2,
        source: 'this.list.0.name',
      },
    },
    {
      template: '<Foo @bar={{this.list.[0]}} />',
      result: {
        message: ERROR_MESSAGE('this.list.0'),
        line: 1,
        column: 12,
        source: 'this.list.0',
      },
    },
  ],
});
