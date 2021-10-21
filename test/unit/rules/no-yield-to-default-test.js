'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-yield-to-default',

  config: true,

  good: [
    '{{yield}}',
    '{{yield to="title"}}',
    '{{has-block}}',
    '{{has-block "title"}}',
    '{{has-block-params}}',
    '{{has-block-params "title"}}',
    '{{hasBlock}}',
    '{{hasBlock "title"}}',
    '{{hasBlockParams}}',
    '{{hasBlockParams "title"}}',
  ],

  bad: [
    {
      template: '{{yield to="default"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "to=\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{has-block "default"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{has-block-params "default"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{hasBlock "default"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{hasBlockParams "default"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 17,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (has-block "default")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 16,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (has-block "default")}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 17,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (has-block-params "default")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 23,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (has-block-params "default")}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 24,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (hasBlock "default")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (hasBlock "default")}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 16,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (hasBlockParams "default")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (hasBlockParams "default")}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A block named \\"default\\" is not valid",
              "rule": "no-yield-to-default",
              "severity": 2,
              "source": "\\"default\\"",
            },
          ]
        `);
      },
    },
  ],
});
