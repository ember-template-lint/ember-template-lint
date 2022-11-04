import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-index-component-invocation',

  config: 'true',
  good: [
    '<Foo::Bar />',
    '<Foo::IndexItem />',
    '<Foo::MyIndex />',
    '<Foo::MyIndex></Foo::MyIndex>',
    '{{foo/index-item}}',
    '{{foo/my-index}}',
    '{{foo/bar}}',
    '{{#foo/bar}}{{/foo/bar}}',
    '{{component "foo/bar"}}',
    '{{component "foo/my-index"}}',
    '{{component "foo/index-item"}}',
    '{{#component "foo/index-item"}}{{/component}}',
  ],

  bad: [
    {
      template: '{{foo/index}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 11,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`{{foo/index ...\` to \`{{foo ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "foo/index",
            },
          ]
        `);
      },
    },
    {
      template: '{{component "foo/index"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`{{component \\"foo/index\\" ...\` to \`{{component \\"foo\\" ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "\\"foo/index\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo/index}}{{/foo/index}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 12,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`{{#foo/index ...\` to \`{{#foo ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "foo/index",
            },
          ]
        `);
      },
    },
    {
      template: '{{#component "foo/index"}}{{/component}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`{{#component \\"foo/index\\" ...\` to \`{{#component \\"foo\\" ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "\\"foo/index\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo/bar (component "foo/index")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`(component \\"foo/index\\" ...\` to \`(component \\"foo\\" ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "\\"foo/index\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo/bar name=(component "foo/index")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 26,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`(component \\"foo/index\\" ...\` to \`(component \\"foo\\" ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "\\"foo/index\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo::Index />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`<Foo::Index ...\` to \`<Foo ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "<Foo::Index />",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo::Bar::Index />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`<Foo::Bar::Index ...\` to \`<Foo::Bar ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "<Foo::Bar::Index />",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo::Index></Foo::Index>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Replace \`<Foo::Index ...\` to \`<Foo ...\`",
              "rule": "no-index-component-invocation",
              "severity": 2,
              "source": "<Foo::Index></Foo::Index>",
            },
          ]
        `);
      },
    },
  ],
});
