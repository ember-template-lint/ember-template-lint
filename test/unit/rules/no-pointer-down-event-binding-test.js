'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-pointer-down-event-binding');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-pointer-down-event-binding',

  config: true,

  good: [
    // Typical event binding
    "<div {{on 'mouseup' this.doSomething}}></div>",
    "<div {{action this.doSomething on='mouseup'}}></div>",
    // DOM event handling through attributes
    '<input type="text" onmouseup="myFunction()">',
    // For now, we're not catching component arguments
    '{{my-component mouseDown=this.doSomething}}',
    '<MyComponent @mouseDown={{this.doSomething}} />',
  ],

  bad: [
    {
      template: "<div {{on 'mousedown' this.doSomething}}></div>",
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 10,
        source: "'mousedown'",
      },
    },
    {
      template: "<div {{action this.doSomething on='mousedown'}}></div>",
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: "'mousedown'",
      },
    },
    {
      // Detecting the `on` param works, even if it's not the first hash param to `{{action}}`
      template: "<div {{action this.doSomething preventDefault=true on='mousedown'}}></div>",
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 54,
        source: "'mousedown'",
      },
    },
    {
      // DOM event handling through attributes
      template: '<input type="text" onmousedown="myFunction()">',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 19,
        source: 'onmousedown="myFunction()"',
      },
    },
  ],
});
