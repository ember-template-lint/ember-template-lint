import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-dynamic-subexpression-invocations',

  config: true,

  good: [
    '{{something "here"}}',
    '{{something}}',
    '{{something here="goes"}}',
    '<button onclick={{fn something "here"}}></button>',
    '{{@thing "somearg"}}',
    '<Foo @bar="asdf" />',
    '<Foo @bar={{"asdf"}} />',
    '<Foo @bar={{true}} />',
    '<Foo @bar={{false}} />',
    '<Foo @bar={{undefined}} />',
    '<Foo @bar={{null}} />',
    '<Foo @bar={{1}} />',
    '{{1}}',
    '{{true}}',
    '{{null}}',
    '{{undefined}}',
    '{{"foo"}}',
  ],

  bad: [
    {
      template: '<Foo bar="{{@thing "some-arg"}}" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{@thing \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo {{this.foo}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You cannot invoke a dynamic value in the ElementModifierStatement position",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{this.foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo {{@foo}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You cannot invoke a dynamic value in the ElementModifierStatement position",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{@foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo {{foo.bar}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You cannot invoke a dynamic value in the ElementModifierStatement position",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{foo.bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button onclick={{@thing "some-arg"}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{@thing \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{#let "whatever" as |thing|}}<button onclick={{thing "some-arg"}}></button>{{/let}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 46,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{thing \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button onclick={{this.thing "some-arg"}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{this.thing \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button onclick={{lol.other.path "some-arg"}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{lol.other.path \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (this.foo) "true" "false"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You cannot invoke a dynamic value in the SubExpression position",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "(this.foo)",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @bar={{@thing "some-arg"}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{@thing \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo onclick={{@thing "some-arg"}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You must use the \`fn\` helper to create a function with arguments to invoke",
              "rule": "no-dynamic-subexpression-invocations",
              "severity": 2,
              "source": "{{@thing \\"some-arg\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
