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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a \`down\` event; bind to an \`up\` event instead",
              "rule": "no-down-event-binding",
              "severity": 2,
              "source": "'keydown'",
            },
          ]
        `);
      },
    },
    {
      template: "<div {{action this.doSomething on='keydown'}}></div>",
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 34,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a \`down\` event; bind to an \`up\` event instead",
              "rule": "no-down-event-binding",
              "severity": 2,
              "source": "'keydown'",
            },
          ]
        `);
      },
    },
    {
      // Detecting the `on` param works, even if it's not the first hash param to `{{action}}`
      template: "<div {{action this.doSomething preventDefault=true on='keydown'}}></div>",
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 54,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a \`down\` event; bind to an \`up\` event instead",
              "rule": "no-down-event-binding",
              "severity": 2,
              "source": "'keydown'",
            },
          ]
        `);
      },
    },
    {
      // DOM event handling through attributes
      template: '<input type="text" onkeydown="myFunction()">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a \`down\` event; bind to an \`up\` event instead",
              "rule": "no-down-event-binding",
              "severity": 2,
              "source": "onkeydown=\\"myFunction()\\"",
            },
          ]
        `);
      },
    },
  ],
});
