import generateRuleTests from '../../helpers/rule-test-harness.js';

const RULE_NAME = 'no-obscure-array-access';
generateRuleTests({
  name: RULE_NAME,

  config: true,

  good: [
    "{{foo bar=(get this 'list.0' )}}",
    "<Foo @bar={{get this 'list.0'}}",
    "{{get this 'list.0'}}",
    '{{foo bar @list}}',
    'Just a regular text in the template bar.[1] bar.1',
    '<Foo foo="bar.[1]" />',
    `<FooBar
    @subHeaderText={{if
      this.isFooBarV2Enabled
      "foobar"
    }}
  />`,
  ],

  bad: [
    {
      template: '{{foo bar=this.list.[0]}}',
      fixedTemplate: '{{foo bar=(get this.list "0")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-obscure-array-access",
              "severity": 2,
              "source": "this.list.0",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo bar=@list.[1]}}',
      fixedTemplate: '{{foo bar=(get @list "1")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-obscure-array-access",
              "severity": 2,
              "source": "@list.1",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.[0]}}',
      fixedTemplate: '{{get this.list "0"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-obscure-array-access",
              "severity": 2,
              "source": "this.list.0",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.[0].name}}',
      fixedTemplate: '{{get this.list "0.name"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-obscure-array-access",
              "severity": 2,
              "source": "this.list.0.name",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @bar={{this.list.[0]}} />',
      fixedTemplate: '<Foo @bar={{get this.list "0"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-obscure-array-access",
              "severity": 2,
              "source": "this.list.0",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @bar={{this.list.[0].name.[1].foo}} />',
      fixedTemplate: '<Foo @bar={{get this.list "0.name.1.foo"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-obscure-array-access",
              "severity": 2,
              "source": "this.list.0.name.1.foo",
            },
          ]
        `);
      },
    },
  ],
});
