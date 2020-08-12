'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-redundant-fn').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-redundant-fn',

  config: true,

  good: [
    '<button {{on "click" this.handleClick}}>Click Me</button>',
    '<button {{on "click" (fn this.handleClick "foo")}}>Click Me</button>',
    '<SomeComponent @onClick={{this.handleClick}} />',
    '<SomeComponent @onClick={{fn this.handleClick "foo"}} />',
    '{{foo bar=this.handleClick}}>',
    '{{foo bar=(fn this.handleClick "foo")}}>',
  ],

  bad: [
    {
      template: '<button {{on "click" (fn this.handleClick)}}>Click Me</button>',
      fixedTemplate: '<button {{on "click" this.handleClick}}>Click Me</button>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 21,
        source: '(fn this.handleClick)',
        isFixable: true,
      },
    },
    {
      template: '<SomeComponent @onClick={{fn this.handleClick}} />',
      fixedTemplate: '<SomeComponent @onClick={{this.handleClick}} />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 24,
        source: '{{fn this.handleClick}}',
        isFixable: true,
      },
    },
    {
      template: '{{foo bar=(fn this.handleClick)}}>',
      fixedTemplate: '{{foo bar=this.handleClick}}>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 10,
        source: '(fn this.handleClick)',
        isFixable: true,
      },
    },
  ],
});
