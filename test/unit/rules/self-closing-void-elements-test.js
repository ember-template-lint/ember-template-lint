'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<area>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<base>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<br>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<col>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<command>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<embed>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<hr>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<img>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<input>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<keygen>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<link>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<meta>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<param>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<source>",
              },
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

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<track>",
              },
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
      config: true,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<wbr>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<area/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<base/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 4,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<br/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<col/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<command/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<embed/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 4,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<hr/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<img/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<input/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<keygen/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<link/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<meta/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<param/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<source/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<track/>",
              },
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
      config: 'require',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<wbr/>",
              },
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
  ],
});
