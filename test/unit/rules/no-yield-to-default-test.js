'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-yield-to-default');
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
