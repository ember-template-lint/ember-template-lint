import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-chained-this',

  config: true,

  good: [
    '{{this.value}}',
    '{{this.thisvalue}}',
    '<this.Component />',
    '{{component this.dynamicComponent}}',
    '{{@argName}}',
  ],

  bad: [
    {
      template: '{{this.this.value}}',
      fixedTemplate: '{{this.value}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 2,
     "endColumn": 17,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.",
     "rule": "no-chained-this",
     "severity": 2,
     "source": "this.this.value",
   },
 ]
          `);
      },
    },
    {
      template: '{{#this.this.value}}woo{{/this.this.value}}',
      fixedTemplate: '{{#this.value}}woo{{/this.value}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 3,
     "endColumn": 18,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.",
     "rule": "no-chained-this",
     "severity": 2,
     "source": "this.this.value",
   },
 ]
        `);
      },
    },
    {
      template: '{{helper value=this.this.foo}}',
      fixedTemplate: '{{helper value=this.foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 15,
     "endColumn": 28,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.",
     "rule": "no-chained-this",
     "severity": 2,
     "source": "this.this.foo",
   },
 ]
        `);
      },
    },
    {
      template: '<this.this.Component />',
      fixedTemplate: '<this.Component />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 0,
     "endColumn": 23,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.",
     "rule": "no-chained-this",
     "severity": 2,
     "source": "<this.this.Component />",
   },
 ]
          `);
      },
    },
    {
      template: '{{#if this.this.condition}}true{{/if}}',
      fixedTemplate: '{{#if this.condition}}true{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 6,
     "endColumn": 25,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.",
     "rule": "no-chained-this",
     "severity": 2,
     "source": "this.this.condition",
   },
 ]
        `);
      },
    },
    {
      template: '{{component this.this.dynamicComponent}}',
      fixedTemplate: '{{component this.dynamicComponent}}',
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
     "message": "this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.",
     "rule": "no-chained-this",
     "severity": 2,
     "source": "this.this.dynamicComponent",
   },
 ]
        `);
      },
    },
  ],
});
