'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { makeErrorMessage } = require('../../../lib/rules/no-passed-in-event-handlers');

generateRuleTests({
  name: 'no-passed-in-event-handlers',

  config: 'true',
  good: [
    '<Foo />',
    '<Foo @onClick={{this.handleClick}} />',
    '<Foo @onclick={{this.handleClick}} />',
    '<Foo @Click={{this.handleClick}} />',
    '<Foo @touch={{this.handleClick}} />',
    '<Foo @random="foo" />',
    '<Foo @random={{true}} />',
    '<Input @click={{this.handleClick}} />',
    '<Textarea @click={{this.handleClick}} />',

    '{{foo}}',
    '{{foo onClick=this.handleClick}}',
    '{{foo onclick=this.handleClick}}',
    '{{foo Click=this.handleClick}}',
    '{{foo touch=this.handleClick}}',
    '{{foo random="foo"}}',
    '{{foo random=true}}',
    '{{input click=this.handleClick}}',
    '{{textarea click=this.handleClick}}',
  ],
  bad: [
    {
      template: '<Foo @click={{this.handleClick}} />',

      result: {
        message: makeErrorMessage('click'),
        source: '@click={{this.handleClick}}',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<Foo @keyPress={{this.handleClick}} />',

      result: {
        message: makeErrorMessage('keyPress'),
        source: '@keyPress={{this.handleClick}}',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<Foo @submit={{this.handleClick}} />',

      result: {
        message: makeErrorMessage('submit'),
        source: '@submit={{this.handleClick}}',
        line: 1,
        column: 5,
      },
    },
    {
      template: '{{foo click=this.handleClick}}',

      result: {
        message: makeErrorMessage('click'),
        source: 'click=this.handleClick',
        line: 1,
        column: 6,
      },
    },
    {
      template: '{{foo keyPress=this.handleClick}}',

      result: {
        message: makeErrorMessage('keyPress'),
        source: 'keyPress=this.handleClick',
        line: 1,
        column: 6,
      },
    },
    {
      template: '{{foo submit=this.handleClick}}',

      result: {
        message: makeErrorMessage('submit'),
        source: 'submit=this.handleClick',
        line: 1,
        column: 6,
      },
    },
  ],
});
