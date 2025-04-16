import generateRuleTests from '../../helpers/rule-test-harness.js';

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
      template: '<div {{on "mousedown" this.doSomething}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a pointer \`down\` event; bind to a pointer \`up\` event instead",
              "rule": "no-pointer-down-event-binding",
              "severity": 2,
              "source": ""mousedown"",
            },
          ]
        `);
      },
    },
    {
      template: '<div {{action this.doSomething on="mousedown"}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a pointer \`down\` event; bind to a pointer \`up\` event instead",
              "rule": "no-pointer-down-event-binding",
              "severity": 2,
              "source": ""mousedown"",
            },
          ]
        `);
      },
    },
    {
      // Detecting the `on` param works, even if it's not the first hash param to `{{action}}`
      template: '<div {{action this.doSomething preventDefault=true on="mousedown"}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 54,
              "endColumn": 65,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a pointer \`down\` event; bind to a pointer \`up\` event instead",
              "rule": "no-pointer-down-event-binding",
              "severity": 2,
              "source": ""mousedown"",
            },
          ]
        `);
      },
    },
    {
      // DOM event handling through attributes
      template: '<input type="text" onmousedown="myFunction()">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a pointer \`down\` event; bind to a pointer \`up\` event instead",
              "rule": "no-pointer-down-event-binding",
              "severity": 2,
              "source": "onmousedown="myFunction()"",
            },
          ]
        `);
      },
    },
  ],
});
