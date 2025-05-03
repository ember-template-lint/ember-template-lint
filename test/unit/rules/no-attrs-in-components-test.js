import generateRuleTests from '../../helpers/rule-test-harness.js';

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
          [
            {
              "column": 2,
              "endColumn": 11,
              "endLine": 1,
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
          [
            {
              "column": 13,
              "endColumn": 22,
              "endLine": 1,
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
          [
            {
              "column": 6,
              "endColumn": 15,
              "endLine": 1,
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
          [
            {
              "column": 10,
              "endColumn": 19,
              "endLine": 1,
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
          [
            {
              "column": 12,
              "endColumn": 21,
              "endLine": 1,
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
          [
            {
              "column": 20,
              "endColumn": 29,
              "endLine": 1,
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
          [
            {
              "column": 2,
              "endColumn": 11,
              "endLine": 1,
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
