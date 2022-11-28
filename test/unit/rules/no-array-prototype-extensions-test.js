import generateRuleTests from '../../helpers/rule-test-harness.js';

const RULE_NAME = 'no-array-prototype-extensions';
generateRuleTests({
  name: RULE_NAME,

  config: true,

  good: [
    "{{foo bar=(get this 'list.0' )}}",
    "<Foo @bar={{get this 'list.0'}}",
    "{{get this 'list.0.foo'}}",
    "{{get this 'firstObject'}}",
    "{{get this 'lastObject.name'}}",
    '{{foo bar @list}}',
    '{{this.firstObject}}',
    '{{this.lastObject.name}}',
    '{{firstObject}}',
    '{{lastObject}}',
    '{{notfirstObject}}',
    '{{@firstObject}}',
    '{{@lastObject}}',
    '{{@lastObject.name}}',
    '{{foo bar this.firstObject}}',
    '{{foo bar this.lastObject.name}}',
    '{{foo bar @lastObject}}',
    '{{foo bar @firstObject}}',
    '{{foo bar @lastObject.name}}',
    '{{foo bar @list.notfirstObject}}',
    '{{foo bar @list.lastObjectV2}}',
    'Just a regular text in the template bar.firstObject bar.lastObject.foo',
    '<Foo foo="bar.firstObject.baz" />',
    '<Foo foo="lastObject" />',
    `<FooBar
     @subHeaderText={{if
      this.isFooBarV2Enabled
      "firstObject"
    }}
  />`,
    `<FooBar
     @subHeaderText={{if
      this.isFooBarV2Enabled
      "hi.lastObject.name"
    }}
  />`,
  ],

  bad: [
    /** Non-fixable `lastObject` */
    {
      template: '{{foo bar=@list.lastObject.test}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Array prototype extension property lastObject usage is disallowed.",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "@list.lastObject.test",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.lastObject}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Array prototype extension property lastObject usage is disallowed.",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "this.list.lastObject",
            },
          ]
        `);
      },
    },
    {
      template: "<Foo @bar={{get this 'list.lastObject'}} />",
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "Array prototype extension property lastObject usage is disallowed.",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "get",
            },
          ]
        `);
      },
    },
    /** Fixable `firstObject` */
    {
      template: `<div data-test={{eq this.list.firstObject.abc "def"}}>Hello</div>`,
      fixedTemplate: '<div data-test={{eq (get this.list "0.abc") "def"}}>Hello</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 20,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "this.list.firstObject.abc",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo bar=this.list.firstObject}}',
      fixedTemplate: '{{foo bar=(get this.list "0")}}',
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
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "this.list.firstObject",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.firstObject}}',
      fixedTemplate: '{{get this.list "0"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "this.list.firstObject",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.firstObject.name}}',
      fixedTemplate: '{{get this.list "0.name"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "this.list.firstObject.name",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @bar={{@list.firstObject}} />',
      fixedTemplate: '<Foo @bar={{get @list "0"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "@list.firstObject",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @bar={{this.list.firstObject.name.foo}} />',
      fixedTemplate: '<Foo @bar={{get this.list "0.name.foo"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "this.list.firstObject.name.foo",
            },
          ]
        `);
      },
    },
    {
      template: "<Foo @bar={{get this 'list.firstObject'}} />",
      fixedTemplate: "<Foo @bar={{get this 'list.0'}} />",
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "get",
            },
          ]
        `);
      },
    },
    {
      template: "<Foo @bar={{get @list 'firstObject.name'}} />",
      fixedTemplate: "<Foo @bar={{get @list '0.name'}} />",
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Array prototype extension property firstObject usage is disallowed. Please use Ember's get helper instead. e.g. {{get @list '0'}}",
              "rule": "no-array-prototype-extensions",
              "severity": 2,
              "source": "get",
            },
          ]
        `);
      },
    },
  ],
});
