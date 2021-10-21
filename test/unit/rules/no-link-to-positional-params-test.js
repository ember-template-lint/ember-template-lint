'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-link-to-positional-params',

  config: true,

  good: [
    '{{#link-to route="about"}}About Us{{/link-to}}',
    '{{#link-to route="post" model=@post}}Read {{@post.title}}...{{/link-to}}',
    `{{#link-to route="post.comment" models=(array post comment)}}
        Comment by {{comment.author.name}} on {{comment.date}}
      {{/link-to}}`,
    `{{#link-to route="posts" query=(hash direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}`,
    '<LinkTo @route="about">About Us</LinkTo>',
    '<LinkTo @route="post" @model={{@post}}>Read {{@post.title}}...</LinkTo>',
    `<LinkTo @route="post.comment" @models={{array post comment}}>
        Comment by {{comment.author.name}} on {{comment.date}}
      </LinkTo>`,
    `<LinkTo @route="posts" @query={{hash direction="desc" showArchived=false}}>
        Recent Posts
      </LinkTo>`,
  ],

  bad: [
    {
      template: '{{link-to "About Us" "about"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to \\"About Us\\" \\"about\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to "About Us" (if this.showNewAboutPage "about-us" "about")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 68,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to \\"About Us\\" (if this.showNewAboutPage \\"about-us\\" \\"about\\")}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to (t "about") "about"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to (t \\"about\\") \\"about\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to (t \\"about\\") this.aboutRoute}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute "foo"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`model\`). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to (t \\"about\\") this.aboutRoute \\"foo\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute "foo" "bar"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`models\`). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to (t \\"about\\") this.aboutRoute \\"foo\\" \\"bar\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute "foo" "bar" (query-params foo="bar")}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 76,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`models\`, \`query\` using the \`hash\` helper). The content should be passed along as a block.",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{link-to (t \\"about\\") this.aboutRoute \\"foo\\" \\"bar\\" (query-params foo=\\"bar\\")}}",
            },
          ]
        `);
      },
    },

    {
      template: '{{#link-to (if this.showNewAboutPage "about-us" "about")}}About Us{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 78,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to (if this.showNewAboutPage \\"about-us\\" \\"about\\")}}About Us{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to "about"}}About Us{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 40,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to \\"about\\"}}About Us{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to this.aboutRoute}}About Us{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to this.aboutRoute}}About Us{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to this.aboutRoute "foo"}}About Us{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 54,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`model\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to this.aboutRoute \\"foo\\"}}About Us{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to this.aboutRoute "foo" "bar"}}About Us{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`models\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to this.aboutRoute \\"foo\\" \\"bar\\"}}About Us{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{#link-to this.aboutRoute "foo" "bar" (query-params foo="bar")}}About Us{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 85,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`models\`, \`query\` using the \`hash\` helper).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to this.aboutRoute \\"foo\\" \\"bar\\" (query-params foo=\\"bar\\")}}About Us{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to "post" @post}}Read {{@post.title}}...{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`model\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to \\"post\\" @post}}Read {{@post.title}}...{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: `{{#link-to "post.comment" @comment.post @comment}}
        Comment by {{@comment.author.name}} on {{@comment.date}}
      {{/link-to}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 18,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`models\`).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to \\"post.comment\\" @comment.post @comment}}
                  Comment by {{@comment.author.name}} on {{@comment.date}}
                {{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      template: `{{#link-to "posts" (query-params direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 18,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`route\`, \`query\` using the \`hash\` helper).",
              "rule": "no-link-to-positional-params",
              "severity": 2,
              "source": "{{#link-to \\"posts\\" (query-params direction=\\"desc\\" showArchived=false)}}
                  Recent Posts
                {{/link-to}}",
            },
          ]
        `);
      },
    },
  ],
});
