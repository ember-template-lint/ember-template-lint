'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-attrs-in-components',

  config: 'true',
  good: [
    '<div></div>',
    '{{foo}}',
    '<div>{{foo.bar}}</div>',
    '{{attrs.foo}}', // defaults to layout.hbs
  ],
  bad: [
    {
      template: '{{attrs.foo}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "templates/components/layout.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
    {
      template: '<div class={{attrs.foo}}></div>',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "filePath": "templates/components/layout.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if attrs.foo}}bar{{/if}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "filePath": "templates/components/layout.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{bar foo=attrs.foo}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "templates/components/layout.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{component attrs.foo}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "filePath": "templates/components/layout.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{bar/baz (hash foo=attrs.foo)}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 20,
              "filePath": "templates/components/layout.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        filePath: 'components/comment/template.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "components/comment/template.hbs",
              "line": 1,
              "message": "Component templates should not contain \`attrs\`.",
              "rule": "no-attrs-in-components",
              "severity": 2,
              "source": "attrs.foo",
            },
          ]
        `);
      },
    },
  ],
});
