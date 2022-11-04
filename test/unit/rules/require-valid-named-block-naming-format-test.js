import { FORMAT } from '../../../lib/rules/require-valid-named-block-naming-format.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-valid-named-block-naming-format',

  config: true,

  good: [
    // Default config.
    '{{yield}}',
    '{{yield to="fooBar"}}',

    '{{has-block}}',
    '{{has-block "fooBar"}}',

    '{{if (has-block)}}',
    '{{if (has-block "fooBar")}}',

    '{{has-block-params}}',
    '{{has-block-params "fooBar"}}',

    '{{if (has-block-params)}}',
    '{{if (has-block-params "fooBar")}}',

    // Explicit config: `camelCase`.
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{yield to="fooBar"}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block "fooBar"}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block "fooBar")}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block-params "fooBar"}}',
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block-params "fooBar")}}',
    },

    // Explicit config: `kebab-case`.
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{yield to="foo-bar"}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block "foo-bar"}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block "foo-bar")}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block-params "foo-bar"}}',
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block-params "foo-bar")}}',
    },
  ],

  bad: [
    // Default config.
    {
      template: '{{yield to="foo-bar"}}',
      fixedTemplate: '{{yield to="fooBar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "to=\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{has-block "foo-bar"}}',
      fixedTemplate: '{{has-block "fooBar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (has-block "foo-bar")}}',
      fixedTemplate: '{{if (has-block "fooBar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{has-block-params "foo-bar"}}',
      fixedTemplate: '{{has-block-params "fooBar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (has-block-params "foo-bar")}}',
      fixedTemplate: '{{if (has-block-params "fooBar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 23,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },

    // Explicit config: `camelCase`.
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{yield to="foo-bar"}}',
      fixedTemplate: '{{yield to="fooBar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "to=\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block "foo-bar"}}',
      fixedTemplate: '{{has-block "fooBar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block "foo-bar")}}',
      fixedTemplate: '{{if (has-block "fooBar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{has-block-params "foo-bar"}}',
      fixedTemplate: '{{has-block-params "fooBar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.CAMEL_CASE,
      template: '{{if (has-block-params "foo-bar")}}',
      fixedTemplate: '{{if (has-block-params "fooBar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 23,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"camelCase\\" naming format. Please change \\"foo-bar\\" to \\"fooBar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"foo-bar\\"",
            },
          ]
        `);
      },
    },

    // Explicit config: `kebab-case`.
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{yield to="fooBar"}}',
      fixedTemplate: '{{yield to="foo-bar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"kebab-case\\" naming format. Please change \\"fooBar\\" to \\"foo-bar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "to=\\"fooBar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block "fooBar"}}',
      fixedTemplate: '{{has-block "foo-bar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"kebab-case\\" naming format. Please change \\"fooBar\\" to \\"foo-bar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"fooBar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block "fooBar")}}',
      fixedTemplate: '{{if (has-block "foo-bar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 16,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"kebab-case\\" naming format. Please change \\"fooBar\\" to \\"foo-bar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"fooBar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{has-block-params "fooBar"}}',
      fixedTemplate: '{{has-block-params "foo-bar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"kebab-case\\" naming format. Please change \\"fooBar\\" to \\"foo-bar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"fooBar\\"",
            },
          ]
        `);
      },
    },
    {
      config: FORMAT.KEBAB_CASE,
      template: '{{if (has-block-params "fooBar")}}',
      fixedTemplate: '{{if (has-block-params "foo-bar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 23,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Named blocks are required to use the \\"kebab-case\\" naming format. Please change \\"fooBar\\" to \\"foo-bar\\".",
              "rule": "require-valid-named-block-naming-format",
              "severity": 2,
              "source": "\\"fooBar\\"",
            },
          ]
        `);
      },
    },
  ],
});
