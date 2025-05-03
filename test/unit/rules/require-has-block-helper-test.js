import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-has-block-helper',

  config: true,

  good: [
    '{{has-block}}',
    '{{has-block-params}}',
    '{{something-else}}',
    '{{component test=(if (has-block) "true")}}',
    '{{component test=(if (has-block-params) "true")}}',
    '<SomeComponent someProp={{has-block}}',
    '<SomeComponent someProp={{has-block-params}}',
    '{{#if (has-block)}}{{/if}}',
    '{{#if (has-block-params)}}{{/if}}',
  ],

  bad: [
    {
      template: '{{hasBlock}}',
      fixedTemplate: '{{has-block}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{hasBlockParams}}',
      fixedTemplate: '{{has-block-params}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{if hasBlock "true" "false"}}',
      fixedTemplate: '{{if (has-block) "true" "false"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{if hasBlockParams "true" "false"}}',
      fixedTemplate: '{{if (has-block-params) "true" "false"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (hasBlock) "true" "false"}}',
      fixedTemplate: '{{if (has-block) "true" "false"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (hasBlockParams) "true" "false"}}',
      fixedTemplate: '{{if (has-block-params) "true" "false"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (hasBlock "inverse") "true" "false"}}',
      fixedTemplate: '{{if (has-block "inverse") "true" "false"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{if (hasBlockParams "inverse") "true" "false"}}',
      fixedTemplate: '{{if (has-block-params "inverse") "true" "false"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{component test=(if hasBlock "true")}}',
      fixedTemplate: '{{component test=(if (has-block) "true")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{component test=(if hasBlockParams "true")}}',
      fixedTemplate: '{{component test=(if (has-block-params) "true")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if hasBlock}}{{/if}}',
      fixedTemplate: '{{#if (has-block)}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if hasBlockParams}}{{/if}}',
      fixedTemplate: '{{#if (has-block-params)}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (hasBlock)}}{{/if}}',
      fixedTemplate: '{{#if (has-block)}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (hasBlockParams)}}{{/if}}',
      fixedTemplate: '{{#if (has-block-params)}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (hasBlock "inverse")}}{{/if}}',
      fixedTemplate: '{{#if (has-block "inverse")}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (hasBlockParams "inverse")}}{{/if}}',
      fixedTemplate: '{{#if (has-block-params "inverse")}}{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '<button name={{hasBlock}}></button>',
      fixedTemplate: '<button name={{has-block}}></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '<button name={{hasBlockParams}}></button>',
      fixedTemplate: '<button name={{has-block-params}}></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '<button name={{hasBlock "inverse"}}></button>',
      fixedTemplate: '<button name={{has-block "inverse"}}></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '<button name={{hasBlockParams "inverse"}}></button>',
      fixedTemplate: '<button name={{has-block-params "inverse"}}></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (or isLoading hasLoadFailed hasBlock)}}...{{/if}}',
      fixedTemplate: '{{#if (or isLoading hasLoadFailed (has-block))}}...{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlock\` is deprecated. Use the \`has-block\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlock",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if (or isLoading hasLoadFailed hasBlockParams)}}...{{/if}}',
      fixedTemplate: '{{#if (or isLoading hasLoadFailed (has-block-params))}}...{{/if}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "\`hasBlockParams\` is deprecated. Use the \`has-block-params\` helper instead.",
              "rule": "require-has-block-helper",
              "severity": 2,
              "source": "hasBlockParams",
            },
          ]
        `);
      },
    },
  ],
});
