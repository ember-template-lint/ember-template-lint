import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-passed-in-event-handlers',

  config: true,
  good: [
    '<Foo />',
    '<Foo @onClick={{this.handleClick}} />',
    '<Foo @onclick={{this.handleClick}} />',
    '<Foo @Click={{this.handleClick}} />',
    '<Foo @touch={{this.handleClick}} />',
    '<Foo @random="foo" />',
    '<Foo @random={{true}} />',
    '<Input @click={{this.handleClick}} />',
    '<Textarea @click={{this.handleClick}} />',

    '{{foo}}',
    '{{foo onClick=this.handleClick}}',
    '{{foo onclick=this.handleClick}}',
    '{{foo Click=this.handleClick}}',
    '{{foo touch=this.handleClick}}',
    '{{foo random="foo"}}',
    '{{foo random=true}}',
    '{{input click=this.handleClick}}',
    '{{textarea click=this.handleClick}}',

    {
      config: {
        ignore: {
          Foo: ['click'],
        },
      },
      template: '<Foo @click={{this.handleClick}} />',
    },
    {
      config: {
        ignore: {
          foo: ['click'],
        },
      },
      template: '{{foo click=this.handleClick}}',
    },
    {
      config: {
        ignore: {
          Foo: ['submit'],
        },
      },
      template: '<Foo @submit={{this.handleClick}} />',
    },

    {
      config: {
        ignore: {
          foo: ['submit'],
        },
      },
      template: '{{foo submit=this.handleClick}}',
    },
  ],
  bad: [
    {
      template: '<Foo @click={{this.handleClick}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Event handler methods like \`click\` should not be passed in as a component arguments",
              "rule": "no-passed-in-event-handlers",
              "severity": 2,
              "source": "@click={{this.handleClick}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @keyPress={{this.handleClick}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Event handler methods like \`keyPress\` should not be passed in as a component arguments",
              "rule": "no-passed-in-event-handlers",
              "severity": 2,
              "source": "@keyPress={{this.handleClick}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @submit={{this.handleClick}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Event handler methods like \`submit\` should not be passed in as a component arguments",
              "rule": "no-passed-in-event-handlers",
              "severity": 2,
              "source": "@submit={{this.handleClick}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo click=this.handleClick}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Event handler methods like \`click\` should not be passed in as a component arguments",
              "rule": "no-passed-in-event-handlers",
              "severity": 2,
              "source": "click=this.handleClick",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo keyPress=this.handleClick}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Event handler methods like \`keyPress\` should not be passed in as a component arguments",
              "rule": "no-passed-in-event-handlers",
              "severity": 2,
              "source": "keyPress=this.handleClick",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo submit=this.handleClick}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Event handler methods like \`submit\` should not be passed in as a component arguments",
              "rule": "no-passed-in-event-handlers",
              "severity": 2,
              "source": "submit=this.handleClick",
            },
          ]
        `);
      },
    },
  ],
});
