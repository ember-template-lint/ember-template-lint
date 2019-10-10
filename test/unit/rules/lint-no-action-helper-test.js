'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/lint-no-action-helper').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-action-helper',

  config: true,

  good: [
    '{{#let (fn this.foo bar) as |action|}}<Component @baz={{action}} />{{/let}}',
    '<MyScope as |action|><Component @baz={{action}} /></MyScope>',
    '<button {{on "submit" @action}}>Click Me</button>',
    '<button {{on "submit" this.action}}>Click Me</button>',
  ],

  bad: [
    {
      template: '<button {{action "submit"}}>Submit</button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '{{action "submit"}}',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<FooBar @baz={{action "submit"}} />',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '{{action "submit"}}',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{yield (action "foo")}}',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '(action "foo")',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (action this.foo)}}',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '(action this.foo)',
        line: 1,
        column: 8,
      },
    },
  ],
});
