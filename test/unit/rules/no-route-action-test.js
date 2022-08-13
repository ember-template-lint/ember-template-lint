import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-route-action',

  config: true,

  good: [
    // SubExpression
    `{{custom-component onUpdate=(action 'updateFoo')}}`,
    `{{custom-component onUpdate=(fn this.updateFoo 'bar')}}`,
    `{{custom-component onUpdate=this.updateFoo}}`,
    `<CustomComponent @onUpdate={{if true (action 'updateFoo')}} />`,
    `<CustomComponent @onUpdate={{if true (fn this.updateFoo 'bar')}} />`,
    `<CustomComponent @onUpdate={{if true (this.updateFoo)}} />`,
    `{{yield (hash
      someProp="someVal"
      updateFoo=(fn this.updateFoo)
    )}}`,

    // MustacheStatement
    `<CustomComponent @onUpdate={{action 'updateFoo'}} />`,
    `<CustomComponent @onUpdate={{fn this.updateFoo 'bar'}} />`,
    `<CustomComponent @onUpdate={{this.updateFoo}} />`,

    // Other
    `<div></div>`,
  ],

  bad: [
    // SubExpression
    {
      template: `<CustomComponent @onUpdate={{if true (route-action 'updateFoo' 'bar')}} />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 37,
              "endColumn": 69,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`route-action\` as (route-action 'updateFoo'). Instead, use controller actions.",
              "rule": "no-route-action",
              "severity": 2,
              "source": "(route-action 'updateFoo' 'bar')",
            },
          ]
        `);
      },
    },
    {
      template: `{{custom-component onUpdate=(route-action 'updateFoo' 'bar')}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 28,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`route-action\` as (route-action 'updateFoo'). Instead, use controller actions.",
              "rule": "no-route-action",
              "severity": 2,
              "source": "(route-action 'updateFoo' 'bar')",
            },
          ]
        `);
      },
    },
    {
      template: `{{yield (hash
        someProp="someVal"
        updateFoo=(route-action 'updateFoo')
      )}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 44,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Do not use \`route-action\` as (route-action 'updateFoo'). Instead, use controller actions.",
              "rule": "no-route-action",
              "severity": 2,
              "source": "(route-action 'updateFoo')",
            },
          ]
        `);
      },
    },

    // MustacheStatement
    {
      template: `<CustomComponent
        @onUpdate={{route-action 'updateFoo'}}
      />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 46,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Do not use \`route-action\` as {{route-action 'updateFoo'}}. Instead, use controller actions.",
              "rule": "no-route-action",
              "severity": 2,
              "source": "{{route-action 'updateFoo'}}",
            },
          ]
        `);
      },
    },
    {
      template: `<CustomComponent @onUpdate={{route-action 'updateBar' 'bar'}} />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 61,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use \`route-action\` as {{route-action 'updateBar'}}. Instead, use controller actions.",
              "rule": "no-route-action",
              "severity": 2,
              "source": "{{route-action 'updateBar' 'bar'}}",
            },
          ]
        `);
      },
    },
  ],
});
