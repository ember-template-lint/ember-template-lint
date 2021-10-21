'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-nested-landmark',

  config: true,

  good: [
    '<div><main></main></div>',
    '<div role="application"><div role="document"><div role="application"></div></div></div>',
    '<header><nav></nav></header>', // nested landmarks of different types are okay
    '<div role="banner"><nav></nav></div>',
    '<header><div role="navigation"></div></header>',
    '<div role="banner"><div role="navigation"></div></div>',
  ],

  bad: [
    {
      template: '<main><main></main></main>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <main> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<main></main>",
            },
          ]
        `);
      },
    },
    {
      template: '<main><div><main></main></div></main>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <main> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<main></main>",
            },
          ]
        `);
      },
    },

    {
      template: '<div role="main"><main></main></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 17,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <main> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<main></main>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="main"><div><main></main></div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <main> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<main></main>",
            },
          ]
        `);
      },
    },

    {
      template: '<main><div role="main"></div></main>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <div> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<div role=\\"main\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<main><div><div role="main"></div></div></main>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <div> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<div role=\\"main\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<nav><nav></nav></nav>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <nav> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<nav></nav>",
            },
          ]
        `);
      },
    },
    {
      template: '<header><header></header></header>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <header> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<header></header>",
            },
          ]
        `);
      },
    },
    {
      template: '<header><div role="banner"></div></header>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <div> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<div role=\\"banner\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="contentinfo"><footer></footer></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 24,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Nested landmark elements on <footer> detected. Landmark elements should not be nested within landmark elements of the same name.",
              "rule": "no-nested-landmark",
              "severity": 2,
              "source": "<footer></footer>",
            },
          ]
        `);
      },
    },
  ],
});
