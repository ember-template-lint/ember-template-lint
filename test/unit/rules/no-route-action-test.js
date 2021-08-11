'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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

    // ElementModifierStatement
    `<div {{action 'updateFoo'}}></div>`,
    `<div {{fn this.updateFoo 'bar'}}></div>`,
    `<div {{this.updateFoo}}></div>`,

    // Other
    `<div></div>`,
  ],

  bad: [
    // SubExpression
    {
      template: `<CustomComponent @onUpdate={{if true (route-action 'updateFoo' 'bar')}} />`,
      result: {
        message:
          'Do not use `route-action` as (route-action ...). Instead, use controller actions.',
        line: 1,
        column: 37,
        source: "(route-action 'updateFoo' 'bar')",
      },
    },
    {
      template: `{{custom-component onUpdate=(route-action 'updateFoo' 'bar')}}`,
      result: {
        message:
          'Do not use `route-action` as (route-action ...). Instead, use controller actions.',
        line: 1,
        column: 28,
        source: "(route-action 'updateFoo' 'bar')",
      },
    },
    {
      template: `{{yield (hash
        someProp="someVal"
        updateFoo=(route-action 'updateFoo')
      )}}`,
      result: {
        message:
          'Do not use `route-action` as (route-action ...). Instead, use controller actions.',
        line: 3,
        column: 18,
        source: "(route-action 'updateFoo')",
      },
    },

    // MustacheStatement
    {
      template: `<CustomComponent
        @onUpdate={{route-action 'updateFoo'}}
      />`,
      result: {
        message:
          'Do not use `route-action` as {{route-action ...}}. Instead, use controller actions.',
        line: 2,
        column: 18,
        source: "{{route-action 'updateFoo'}}",
      },
    },
    {
      template: `<CustomComponent @onUpdate={{route-action 'updateFoo' 'bar'}} />`,
      result: {
        message:
          'Do not use `route-action` as {{route-action ...}}. Instead, use controller actions.',
        line: 1,
        column: 27,
        source: "{{route-action 'updateFoo' 'bar'}}",
      },
    },

    // ElementModifierStatement
    {
      template: `<div {{route-action 'updateFoo'}}></div>`,
      result: {
        message:
          'Do not use `route-action` as <div {{route-action ...}} />. Instead, use controller actions.',
        line: 1,
        column: 5,
        source: "{{route-action 'updateFoo'}}",
      },
    },
  ],
});
