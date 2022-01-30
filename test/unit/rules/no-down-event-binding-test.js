import generateRuleTests from '../../helpers/rule-test-harness.js';

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
          [
            {
              "column": 10,
              "endColumn": 19,
              "endLine": 1,
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
          [
            {
              "column": 34,
              "endColumn": 43,
              "endLine": 1,
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
          [
            {
              "column": 54,
              "endColumn": 63,
              "endLine": 1,
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
          [
            {
              "column": 19,
              "endColumn": 43,
              "endLine": 1,
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
