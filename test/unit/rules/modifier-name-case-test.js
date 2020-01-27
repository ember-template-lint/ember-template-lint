'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'modifier-name-case',

  config: true,

  good: [
    '<div {{did-insert}}></div>',
    '<div {{did-insert "something"}}></div>',
    '<div {{did-insert action=something}}></div>',
    '<button {{on "click" somethingAmazing}}></button>',
    '<button onclick={{do-a-thing "foo"}}></button>',
    '<button onclick={{doAThing "foo"}}></button>',
    '<a href="#" onclick={{amazingActionThing "foo"}} {{did-insert}}></a>',
    '<div didInsert></div>',
  ],

  bad: [
    {
      template: '<div {{didInsert}}></div>',
      result: {
        message:
          'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        source: 'didInsert',
        line: 1,
        column: 7,
      },
    },
    {
      template: '<div class="monkey" {{didInsert "something" with="somethingElse"}}></div>',
      result: {
        message:
          'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        source: 'didInsert',
        line: 1,
        column: 22,
      },
    },
    {
      template: '<a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a>',
      result: {
        message:
          'Use dasherized names for modifier invocation. Please replace `doSomething` with `do-something`.',
        source: 'doSomething',
        line: 1,
        column: 51,
      },
    },
  ],
});
