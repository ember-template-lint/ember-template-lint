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
      template: '{{link-to "about"}}',
      result: {
        message:
          'Invoking the `<LinkTo>` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`@route`).',
        line: 1,
        column: 0,
        source: '{{link-to "about"}}',
      },
    },
    {
      template: '{{link-to "About Us" "about"}}',
      result: {
        message: `Invoking the \`<LinkTo>\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`@route\`) and pass a
  block for the link's content.`,
        line: 1,
        column: 0,
        source: '{{link-to "About Us" "about"}}',
      },
    },
    {
      template: '{{#link-to "about"}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `<LinkTo>` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`@route`).',
        line: 1,
        column: 0,
        source: '{{#link-to "about"}}About Us{{/link-to}}',
      },
    },
    {
      template: '{{#link-to "post" @post}}Read {{@post.title}}...{{/link-to}}',
      result: {
        message:
          'Invoking the `<LinkTo>` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`@route`, `@model`).',
        line: 1,
        column: 0,
        source: '{{#link-to "post" @post}}Read {{@post.title}}...{{/link-to}}',
      },
    },
    {
      template: `{{#link-to "post.comment" @comment.post @comment}}
        Comment by {{@comment.author.name}} on {{@comment.date}}
      {{/link-to}}`,
      result: {
        message:
          'Invoking the `<LinkTo>` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`@route`, `@models`).',
        line: 1,
        column: 0,
        source: `{{#link-to "post.comment" @comment.post @comment}}
        Comment by {{@comment.author.name}} on {{@comment.date}}
      {{/link-to}}`,
      },
    },
    {
      template: `{{#link-to "posts" (query-params direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}`,
      result: {
        message: `Invoking the \`<LinkTo>\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (\`@route\`, \`@query\`) and the
\`hash\` helper.`,
        line: 1,
        column: 0,
        source: `{{#link-to "posts" (query-params direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}`,
      },
    },
  ],
});
