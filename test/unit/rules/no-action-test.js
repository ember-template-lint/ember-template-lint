'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-action');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-action',

  config: true,

  good: [
    '{{#let (fn this.foo bar) as |action|}}<Component @baz={{action}} />{{/let}}',
    '<MyScope as |action|><Component @baz={{action}} /></MyScope>',
    '<button {{on "submit" @action}}>Click Me</button>',
    '<button {{on "submit" this.action}}>Click Me</button>',
    // check for scope.getLocalName working for primitives and locals #881
    '<PButton @naked={{42}} />',
    '<PButton @naked={{true}} />',
    '<PButton @naked={{undefined}} />',
    '<PButton @naked={{null}} />',
    '<PButton @naked={{this}} />',
    '<PButton @naked={{"action"}} />',
  ],

  bad: [
    {
      template: '<button onclick={{action "foo"}}></button>',
      result: {
        message: ERROR_MESSAGE.replace('%', '{{action ...}}'),
        source: '{{action "foo"}}',
        line: 1,
        column: 16,
      },
    },
    {
      template: '<button {{action "submit"}}>Submit</button>',
      result: {
        message: ERROR_MESSAGE.replace('%', '<button {{action ...}} />'),
        source: '{{action "submit"}}',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<FooBar @baz={{action "submit"}} />',
      result: {
        message: ERROR_MESSAGE.replace('%', '{{action ...}}'),
        source: '{{action "submit"}}',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{yield (action "foo")}}',
      result: {
        message: ERROR_MESSAGE.replace('%', '(action ...)'),
        source: '(action "foo")',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{yield (action this.foo)}}',
      result: {
        message: ERROR_MESSAGE.replace('%', '(action ...)'),
        source: '(action this.foo)',
        line: 1,
        column: 8,
      },
    },
  ],
});
