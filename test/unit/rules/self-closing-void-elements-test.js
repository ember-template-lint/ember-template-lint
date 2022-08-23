import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'self-closing-void-elements',

  config: true,

  good: [
    '<area>',
    '<base>',
    '<br>',
    '<col>',
    '<command>',
    '<embed>',
    '<hr>',
    '<img>',
    '<input>',
    '<keygen>',
    '<link>',
    '<meta>',
    '<param>',
    '<source>',
    '<track>',
    '<wbr>',
    {
      config: 'require',
      template: '<area/>',
    },
    {
      config: 'require',
      template: '<base/>',
    },
    {
      config: 'require',
      template: '<br/>',
    },
    {
      config: 'require',
      template: '<col/>',
    },
    {
      config: 'require',
      template: '<command/>',
    },
    {
      config: 'require',
      template: '<embed/>',
    },
    {
      config: 'require',
      template: '<hr/>',
    },
    {
      config: 'require',
      template: '<img/>',
    },
    {
      config: 'require',
      template: '<input/>',
    },
    {
      config: 'require',
      template: '<keygen/>',
    },
    {
      config: 'require',
      template: '<link/>',
    },
    {
      config: 'require',
      template: '<meta/>',
    },
    {
      config: 'require',
      template: '<param/>',
    },
    {
      config: 'require',
      template: '<source/>',
    },
    {
      config: 'require',
      template: '<track/>',
    },
    {
      config: 'require',
      template: '<wbr/>',
    },
  ],

  bad: [
    {
      template: '<area/>',
      fixedTemplate: '<area>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<area>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<area/>",
            },
          ]
        `);
      },
    },
    {
      template: '<base/>',
      fixedTemplate: '<base>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<base>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<base/>",
            },
          ]
        `);
      },
    },
    {
      template: '<br/>',
      fixedTemplate: '<br>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<br>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<br/>",
            },
          ]
        `);
      },
    },
    {
      template: '<col/>',
      fixedTemplate: '<col>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<col>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<col/>",
            },
          ]
        `);
      },
    },
    {
      template: '<command/>',
      fixedTemplate: '<command>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<command>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<command/>",
            },
          ]
        `);
      },
    },
    {
      template: '<embed/>',
      fixedTemplate: '<embed>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<embed>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<embed/>",
            },
          ]
        `);
      },
    },
    {
      template: '<hr/>',
      fixedTemplate: '<hr>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<hr>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<hr/>",
            },
          ]
        `);
      },
    },
    {
      template: '<img/>',
      fixedTemplate: '<img>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<img>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<img/>",
            },
          ]
        `);
      },
    },
    {
      template: '<input/>',
      fixedTemplate: '<input>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<input>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<input/>",
            },
          ]
        `);
      },
    },
    {
      template: '<keygen/>',
      fixedTemplate: '<keygen>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<keygen>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<keygen/>",
            },
          ]
        `);
      },
    },
    {
      template: '<link/>',
      fixedTemplate: '<link>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<link>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<link/>",
            },
          ]
        `);
      },
    },
    {
      template: '<meta/>',
      fixedTemplate: '<meta>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<meta>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<meta/>",
            },
          ]
        `);
      },
    },
    {
      template: '<param/>',
      fixedTemplate: '<param>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<param>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<param/>",
            },
          ]
        `);
      },
    },
    {
      template: '<source/>',
      fixedTemplate: '<source>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<source>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<source/>",
            },
          ]
        `);
      },
    },
    {
      template: '<track/>',
      fixedTemplate: '<track>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<track>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<track/>",
            },
          ]
        `);
      },
    },
    {
      template: '<wbr/>',
      fixedTemplate: '<wbr>',
      config: true,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<wbr>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is redundant",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<wbr/>",
            },
          ]
        `);
      },
    },
    {
      template: '<area>',
      fixedTemplate: '<area />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<area/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<area>",
            },
          ]
        `);
      },
    },
    {
      template: '<base>',
      fixedTemplate: '<base />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<base/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<base>",
            },
          ]
        `);
      },
    },
    {
      template: '<br>',
      fixedTemplate: '<br />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 4,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<br/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<br>",
            },
          ]
        `);
      },
    },
    {
      template: '<col>',
      fixedTemplate: '<col />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<col/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<col>",
            },
          ]
        `);
      },
    },
    {
      template: '<command>',
      fixedTemplate: '<command />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<command/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<command>",
            },
          ]
        `);
      },
    },
    {
      template: '<embed>',
      fixedTemplate: '<embed />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<embed/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<embed>",
            },
          ]
        `);
      },
    },
    {
      template: '<hr>',
      fixedTemplate: '<hr />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 4,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<hr/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<hr>",
            },
          ]
        `);
      },
    },
    {
      template: '<img>',
      fixedTemplate: '<img />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<img/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<img>",
            },
          ]
        `);
      },
    },
    {
      template: '<input>',
      fixedTemplate: '<input />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<input/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<input>",
            },
          ]
        `);
      },
    },
    {
      template: '<keygen>',
      fixedTemplate: '<keygen />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<keygen/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<keygen>",
            },
          ]
        `);
      },
    },
    {
      template: '<link>',
      fixedTemplate: '<link />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<link/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<link>",
            },
          ]
        `);
      },
    },
    {
      template: '<meta>',
      fixedTemplate: '<meta />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<meta/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<meta>",
            },
          ]
        `);
      },
    },
    {
      template: '<param>',
      fixedTemplate: '<param />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<param/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<param>",
            },
          ]
        `);
      },
    },
    {
      template: '<source>',
      fixedTemplate: '<source />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<source/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<source>",
            },
          ]
        `);
      },
    },
    {
      template: '<track>',
      fixedTemplate: '<track />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<track/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<track>",
            },
          ]
        `);
      },
    },
    {
      template: '<wbr>',
      fixedTemplate: '<wbr />',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<wbr/>",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<wbr>",
            },
          ]
        `);
      },
    },
    {
      template:
        'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| >bar',
      fixedTemplate:
        'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| />bar',
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 85,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": {
                "text": "<wbr data-custom=\\"50\\" {{my-modifier true \\"baz\\"}} {{!comment}} as |paramA paramB| />",
              },
              "isFixable": true,
              "line": 1,
              "message": "Self-closing a void element is required",
              "rule": "self-closing-void-elements",
              "severity": 2,
              "source": "<wbr data-custom=\\"50\\" {{my-modifier true \\"baz\\"}} {{!comment}} as |paramA paramB| >",
            },
          ]
        `);
      },
    },
  ],
});
