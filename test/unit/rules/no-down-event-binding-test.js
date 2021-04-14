'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-down-event-binding');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-down-event-binding',

  config: true,

  good: [
    // Typical event binding
    "<div {{on 'keyup' this.doSomething}}></div>",
    "<div {{action this.doSomething on='keyup'}}></div>",
    // DOM event handling through attributes
    '<input type="text" onkeyup="myFunction()">',
    // For now, we're not catching component arguments
    '{{my-component keyDown=this.doSomething}}',
    '<MyComponent @keyDown={{this.doSomething}} />',
  ],

  bad: [
    {
      template: "<div {{on 'keydown' this.doSomething}}></div>",
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 10,
        source: "'keydown'",
      },
    },
    {
      template: "<div {{action this.doSomething on='keydown'}}></div>",
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: "'keydown'",
      },
    },
    {
      // Detecting the `on` param works, even if it's not the first hash param to `{{action}}`
      template: "<div {{action this.doSomething preventDefault=true on='keydown'}}></div>",
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 54,
        source: "'keydown'",
      },
    },
    {
      // DOM event handling through attributes
      template: '<input type="text" onkeydown="myFunction()">',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 19,
        source: 'onkeydown="myFunction()"',
      },
    },
  ],
});
