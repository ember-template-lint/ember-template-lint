import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-negated-condition',

  config: true,

  good: [
    // ******************************************
    // BlockStatement
    // ******************************************

    // if ...
    '{{#if condition}}<img>{{/if}}',
    '{{#if (or c1 c2)}}{{/if}}',
    '{{#if (not (or c1 c2))}}{{/if}}', // Valid since we don't want to suggest `unless` with helpers in the condition.
    '{{#if (not c1 c2)}}{{/if}}', // Valid since there is not way to simplify.
    '{{#if (not (not c1) c2)}}<img>{{/if}}',
    '{{#if (not c1 (not c2))}}<img>{{/if}}',
    {
      config: { simplifyHelpers: false },
      template: '{{#if (not (not c2))}}<img>{{/if}}',
    },
    {
      config: { simplifyHelpers: false },
      template: '{{#if (not (eq c2))}}<img>{{/if}}',
    },

    // if ... else ...
    '{{#if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (or c1 c2)}}<img>{{else}}<img>{{/if}}',

    // if ... else if ...
    '{{#if condition}}<img>{{else if condition}}<img>{{/if}}',
    '{{#if condition}}<img>{{else if (not condition2)}}<img>{{/if}}', // we ignore `if ... else if ...`
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{/if}}', // we ignore `if ... else if ...`

    // if ... else if ... else ...
    '{{#if condition}}<img>{{else if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{else}}<img>{{/if}}', // we ignore `if ... else if ...`

    // unless ...
    '{{#unless condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{/unless}}',
    '{{#unless (not c1 c2)}}<img>{{/unless}}',

    // unless ... else ...
    '{{#unless condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else}}<img>{{/unless}}',

    // unless ... else if ...
    '{{#unless condition}}<img>{{else if condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{/unless}}',

    // unless ... else if ... else ...
    '{{#unless condition}}<img>{{else if condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{else}}<img>{{/unless}}',

    // ******************************************
    // MustacheStatement
    // ******************************************

    // if ...
    '<img class={{if condition "some-class"}}>',
    '<img class={{if (or c1 c2) "some-class"}}>',
    '<img class={{if (not (or c1 c2)) "some-class"}}>', // Valid since we don't want to suggest `unless` with helpers in the condition.
    '<img class={{if (not c1 c2) "some-class"}}>',

    // if ... else ...
    '<img class={{if condition "some-class" "other-class"}}>',
    '<img class={{if (or c1 c2) "some-class" "other-class"}}>',

    // unless ...
    '<img class={{unless condition "some-class"}}>',
    '<img class={{unless (or c1 c2) "some-class"}}>',
    '<img class={{unless (not c1 c2) "some-class"}}>',

    // unless ... else ...
    '<img class={{unless condition "some-class" "other-class"}}>',
    '<img class={{unless (or c1 c2) "some-class" "other-class"}}>',

    // ******************************************
    // SubExpression
    // ******************************************

    // if ...
    '{{input class=(if condition "some-class")}}',
    '{{input class=(if (or c1 c2) "some-class")}}',
    '{{input class=(if (not (or c1 c2)) "some-class")}}', // Valid since we don't want to suggest `unless` with helpers in the condition.
    '{{input class=(if (not c1 c2) "some-class")}}',

    // if ... else ...
    '{{input class=(if condition "some-class" "other-class")}}',
    '{{input class=(if (or c1 c2) "some-class" "other-class")}}',

    // unless ...
    '{{input class=(unless condition "some-class")}}',
    '{{input class=(unless (or c1 c2) "some-class")}}',

    // unless ... else ...
    '{{input class=(unless condition "some-class" "other-class")}}',
    '{{input class=(unless (or c1 c2) "some-class" "other-class")}}',
  ],

  bad: [
    // ******************************************
    // BlockStatement
    // ******************************************

    // if ...
    {
      template: '{{#if (not condition)}}<img>{{/if}}',
      fixedTemplate: '{{#unless condition}}<img>{{/unless}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`if (not condition)\` to \`unless condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not condition)}}<img>{{/if}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '{{#if (not (not condition))}}<img>{{/if}}',
      fixedTemplate: '{{#if condition}}<img>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not (not condition))}}<img>{{/if}}",
            },
          ]
        `);
      },
    },
    {
      // no config, allowing simplifyHelpers to default to true.
      template: '{{#if (not (not c1 c2))}}<img>{{/if}}',
      fixedTemplate: '{{#if (or c1 c2)}}<img>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not (not c1 c2))}}<img>{{/if}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '{{#if (not (not c1 c2))}}<img>{{/if}}',
      fixedTemplate: '{{#if (or c1 c2)}}<img>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not (not c1 c2))}}<img>{{/if}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '{{#if (not (eq c1 c2))}}<img>{{/if}}',
      fixedTemplate: '{{#if (not-eq c1 c2)}}<img>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not (eq c1 c2))}}<img>{{/if}}",
            },
          ]
        `);
      },
    },
    // if ... else ...
    {
      template: '{{#if (not condition)}}<img>{{else}}<input>{{/if}}',
      fixedTemplate: '{{#if condition}}<input>{{else}}<img>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`{{if (not condition)}} {{prop1}} {{else}} {{prop2}} {{/if}}\` to \`{{if condition}} {{prop2}} {{else}} {{prop1}} {{/if}}\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not condition)}}<img>{{else}}<input>{{/if}}",
            },
          ]
        `);
      },
    },

    // unless ...
    {
      template: '{{#unless (not condition)}}<img>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not condition)}}<img>{{/unless}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#unless (not (not condition))}}<img>{{/unless}}',
      fixedTemplate: '{{#unless condition}}<img>{{/unless}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 49,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not (not condition))}}<img>{{/unless}}",
            },
          ]
        `);
      },
    },

    // unless ... else ...
    {
      template: '{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else}}<input>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 58,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '{{#unless (not (not-eq c1 c2))}}<img>{{else}}<input>{{/unless}}',
      fixedTemplate: '{{#unless (eq c1 c2)}}<img>{{else}}<input>{{/unless}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not (not-eq c1 c2))}}<img>{{else}}<input>{{/unless}}",
            },
          ]
        `);
      },
    },
    // unless ... else if ...
    {
      template: '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else if (not condition)}}<input>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 77,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template:
        '{{#unless (not (not condition))}}<img>{{else if (not (not condition))}}<input>{{/unless}}',
      fixedTemplate: '{{#unless condition}}<img>{{else if condition}}<input>{{/unless}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 89,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not (not condition))}}<img>{{else if (not (not condition))}}<input>{{/unless}}",
            },
            {
              "column": 38,
              "endColumn": 78,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{else if (not (not condition))}}<input>",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '{{#unless (not (gt c 10))}}<img>{{else if (not (lt c 5))}}<input>{{/unless}}',
      fixedTemplate: '{{#unless (lte c 10)}}<img>{{else if (gte c 5)}}<input>{{/unless}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 76,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not (gt c 10))}}<img>{{else if (not (lt c 5))}}<input>{{/unless}}",
            },
            {
              "column": 32,
              "endColumn": 65,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{else if (not (lt c 5))}}<input>",
            },
          ]
        `);
      },
    },

    // unless ... else if ... else ...
    {
      template:
        '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 89,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template:
        '{{#unless (not condition)}}<img>{{else if (not (not c1 c2))}}<input>{{else}}<hr>{{/unless}}',
      fixedTemplate: '{{#if condition}}<img>{{else if (or c1 c2)}}<input>{{else}}<hr>{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 91,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#unless (not condition)}}<img>{{else if (not (not c1 c2))}}<input>{{else}}<hr>{{/unless}}",
            },
            {
              "column": 32,
              "endColumn": 80,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{else if (not (not c1 c2))}}<input>{{else}}<hr>",
            },
          ]
        `);
      },
    },

    // Nested inside the body of an `else` block (with preceding comment):
    {
      template:
        '{{#if condition}}{{else}}{{! some comment }}{{#if (not condition)}}<img>{{/if}}{{/if}}',
      fixedTemplate:
        '{{#if condition}}{{else}}{{! some comment }}{{#unless condition}}<img>{{/unless}}{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 44,
              "endColumn": 79,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`if (not condition)\` to \`unless condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not condition)}}<img>{{/if}}",
            },
          ]
        `);
      },
    },

    // Nested inside the body of an `else` block (without preceding comment):
    {
      template: '{{#if condition}}{{else}}{{#if (not condition)}}<img>{{/if}}{{/if}}',
      fixedTemplate: '{{#if condition}}{{else}}{{#unless condition}}<img>{{/unless}}{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 25,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`if (not condition)\` to \`unless condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not condition)}}<img>{{/if}}",
            },
          ]
        `);
      },
    },

    // ******************************************
    // MustacheStatement
    // ******************************************

    // if ...
    {
      template: '<img class={{if (not condition) "some-class"}}>',
      fixedTemplate: '<img class={{unless condition "some-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 46,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`if (not condition)\` to \`unless condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{if (not condition) \\"some-class\\"}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '<img class={{if (not (gte c 10)) "some-class"}}>',
      fixedTemplate: '<img class={{if (lt c 10) "some-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{if (not (gte c 10)) \\"some-class\\"}}",
            },
          ]
        `);
      },
    },

    // if ... else ...
    {
      template: '<img class={{if (not condition) "some-class" "other-class"}}>',
      fixedTemplate: '<img class={{if condition "other-class" "some-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`{{if (not condition)}} {{prop1}} {{else}} {{prop2}} {{/if}}\` to \`{{if condition}} {{prop2}} {{else}} {{prop1}} {{/if}}\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{if (not condition) \\"some-class\\" \\"other-class\\"}}",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '<img class={{if (not (not condition)) "some-class" "other-class"}}>',
      fixedTemplate: '<img class={{if condition "some-class" "other-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{if (not (not condition)) \\"some-class\\" \\"other-class\\"}}",
            },
          ]
        `);
      },
    },

    // unless ...
    {
      template: '<img class={{unless (not condition) "some-class"}}>',
      fixedTemplate: '<img class={{if condition "some-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{unless (not condition) \\"some-class\\"}}",
            },
          ]
        `);
      },
    },

    // unless ... else ...
    {
      template: '<img class={{unless (not condition) "some-class" "other-class"}}>',
      fixedTemplate: '<img class={{if condition "some-class" "other-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 64,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{unless (not condition) \\"some-class\\" \\"other-class\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<img class={{unless (not (not condition)) "some-class" "other-class"}}>',
      fixedTemplate: '<img class={{unless condition "some-class" "other-class"}}>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 70,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{unless (not (not condition)) \\"some-class\\" \\"other-class\\"}}",
            },
          ]
        `);
      },
    },
    // ******************************************
    // SubExpression
    // ******************************************

    // if ...
    {
      template: '{{input class=(if (not condition) "some-class")}}',
      fixedTemplate: '{{input class=(unless condition "some-class")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`if (not condition)\` to \`unless condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "(if (not condition) \\"some-class\\")",
            },
          ]
        `);
      },
    },

    // if ... else ...
    {
      template: '{{input class=(if (not condition) "some-class" "other-class")}}',
      fixedTemplate: '{{input class=(if condition "other-class" "some-class")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 61,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`{{if (not condition)}} {{prop1}} {{else}} {{prop2}} {{/if}}\` to \`{{if condition}} {{prop2}} {{else}} {{prop1}} {{/if}}\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "(if (not condition) \\"some-class\\" \\"other-class\\")",
            },
          ]
        `);
      },
    },
    {
      config: { simplifyHelpers: true },
      template: '{{input class=(if (not (lte c 10)) "some-class" "other-class")}}',
      fixedTemplate: '{{input class=(if (gt c 10) "some-class" "other-class")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "(if (not (lte c 10)) \\"some-class\\" \\"other-class\\")",
            },
          ]
        `);
      },
    },

    // unless ...
    {
      template: '{{input class=(unless (not condition) "some-class")}}',
      fixedTemplate: '{{input class=(if condition "some-class")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "(unless (not condition) \\"some-class\\")",
            },
          ]
        `);
      },
    },

    // unless ... else ...
    {
      template: '{{input class=(unless (not condition) "some-class" "other-class")}}',
      fixedTemplate: '{{input class=(if condition "some-class" "other-class")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 65,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`unless (not condition)\` to \`if condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "(unless (not condition) \\"some-class\\" \\"other-class\\")",
            },
          ]
        `);
      },
    },
    {
      template: '{{input class=(unless (not (not condition)) "some-class" "other-class")}}',
      fixedTemplate: '{{input class=(unless condition "some-class" "other-class")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 71,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Simplify unnecessary negation of helper.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "(unless (not (not condition)) \\"some-class\\" \\"other-class\\")",
            },
          ]
        `);
      },
    },
  ],
});
