import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-this-in-template-only-components',

  config: true,

  good: [
    '{{welcome-page}}',
    '<WelcomePage />',
    '<MyComponent @prop={{can "edit" @model}} />',
    '{{my-component model=model}}',
    {
      template: '{{my-component model=this.model}}',
      meta: {
        filePath: 'app/templates/route-template.hbs',
      },
    },
  ],

  bad: [
    {
      template: '{{my-component model=this.model}}',
      fixedTemplate: '{{my-component model=@model}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Usage of 'this' in path 'this.model' is not allowed in a template-only component. Use '@model' if it is a named argument or create a component.js for this component.",
              "rule": "no-this-in-template-only-components",
              "severity": 2,
              "source": "this.model",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component action=(action this.myAction)}}',
      fixedTemplate: '{{my-component action=(action @myAction)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 30,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Usage of 'this' in path 'this.myAction' is not allowed in a template-only component. Use '@myAction' if it is a named argument or create a component.js for this component.",
              "rule": "no-this-in-template-only-components",
              "severity": 2,
              "source": "this.myAction",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent @prop={{can "edit" this.model}} />',
      fixedTemplate: '<MyComponent @prop={{can "edit" @model}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 32,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Usage of 'this' in path 'this.model' is not allowed in a template-only component. Use '@model' if it is a named argument or create a component.js for this component.",
              "rule": "no-this-in-template-only-components",
              "severity": 2,
              "source": "this.model",
            },
          ]
        `);
      },
    },
    {
      template: '{{input id=(concat this.elementId "-username")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Usage of 'this' in path 'this.elementId' is not allowed in a template-only component. Use '@elementId' if it is a named argument or create a component.js for this component.",
              "rule": "no-this-in-template-only-components",
              "severity": 2,
              "source": "this.elementId",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component model=this.model}}',
      fixedTemplate: '{{my-component model=@model}}',
      meta: {
        filePath: 'app/templates/components/some-component.hbs',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "app/templates/components/some-component.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Usage of 'this' in path 'this.model' is not allowed in a template-only component. Use '@model' if it is a named argument or create a component.js for this component.",
              "rule": "no-this-in-template-only-components",
              "severity": 2,
              "source": "this.model",
            },
          ]
        `);
      },
    },
  ],
});
