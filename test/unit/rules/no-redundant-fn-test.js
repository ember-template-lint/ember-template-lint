import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-redundant-fn',

  config: true,

  good: [
    '<button {{on "click" this.handleClick}}>Click Me</button>',
    '<button {{on "click" (fn this.handleClick "foo")}}>Click Me</button>',
    '<SomeComponent @onClick={{this.handleClick}} />',
    '<SomeComponent @onClick={{fn this.handleClick "foo"}} />',
    '{{foo bar=this.handleClick}}>',
    '{{foo bar=(fn this.handleClick "foo")}}>',
  ],

  bad: [
    {
      template: '<button {{on "click" (fn this.handleClick)}}>Click Me</button>',
      fixedTemplate: '<button {{on "click" this.handleClick}}>Click Me</button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`fn\` helpers without additional arguments are not allowed",
              "rule": "no-redundant-fn",
              "severity": 2,
              "source": "(fn this.handleClick)",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeComponent @onClick={{fn this.handleClick}} />',
      fixedTemplate: '<SomeComponent @onClick={{this.handleClick}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 24,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`fn\` helpers without additional arguments are not allowed",
              "rule": "no-redundant-fn",
              "severity": 2,
              "source": "{{fn this.handleClick}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo bar=(fn this.handleClick)}}>',
      fixedTemplate: '{{foo bar=this.handleClick}}>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`fn\` helpers without additional arguments are not allowed",
              "rule": "no-redundant-fn",
              "severity": 2,
              "source": "(fn this.handleClick)",
            },
          ]
        `);
      },
    },
  ],
});
