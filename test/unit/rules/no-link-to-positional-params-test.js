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
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to "About Us" "about"}}',
      },
    },
    {
      template: '{{link-to "About Us" (if this.showNewAboutPage "about-us" "about")}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to "About Us" (if this.showNewAboutPage "about-us" "about")}}',
      },
    },
    {
      template: '{{link-to (t "about") "about"}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to (t "about") "about"}}',
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to (t "about") this.aboutRoute}}',
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute "foo"}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `model`). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to (t "about") this.aboutRoute "foo"}}',
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute "foo" "bar"}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `models`). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to (t "about") this.aboutRoute "foo" "bar"}}',
      },
    },
    {
      template: '{{link-to (t "about") this.aboutRoute "foo" "bar" (query-params foo="bar")}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `models`, `query` using the `hash` helper). The content should be passed along as a block.',
        line: 1,
        column: 0,
        source: '{{link-to (t "about") this.aboutRoute "foo" "bar" (query-params foo="bar")}}',
      },
    },

    {
      template: '{{#link-to (if this.showNewAboutPage "about-us" "about")}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`).',
        line: 1,
        column: 0,
        source: '{{#link-to (if this.showNewAboutPage "about-us" "about")}}About Us{{/link-to}}',
      },
    },
    {
      template: '{{#link-to "about"}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`).',
        line: 1,
        column: 0,
        source: '{{#link-to "about"}}About Us{{/link-to}}',
      },
    },
    {
      template: '{{#link-to this.aboutRoute}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`).',
        line: 1,
        column: 0,
        source: '{{#link-to this.aboutRoute}}About Us{{/link-to}}',
      },
    },
    {
      template: '{{#link-to this.aboutRoute "foo"}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `model`).',
        line: 1,
        column: 0,
        source: '{{#link-to this.aboutRoute "foo"}}About Us{{/link-to}}',
      },
    },
    {
      template: '{{#link-to this.aboutRoute "foo" "bar"}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `models`).',
        line: 1,
        column: 0,
        source: '{{#link-to this.aboutRoute "foo" "bar"}}About Us{{/link-to}}',
      },
    },
    {
      template:
        '{{#link-to this.aboutRoute "foo" "bar" (query-params foo="bar")}}About Us{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `models`, `query` using the `hash` helper).',
        line: 1,
        column: 0,
        source:
          '{{#link-to this.aboutRoute "foo" "bar" (query-params foo="bar")}}About Us{{/link-to}}',
      },
    },
    {
      template: '{{#link-to "post" @post}}Read {{@post.title}}...{{/link-to}}',
      result: {
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `model`).',
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
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `models`).',
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
        message:
          'Invoking the `{{link-to}}` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (`route`, `query` using the `hash` helper).',
        line: 1,
        column: 0,
        source: `{{#link-to "posts" (query-params direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}`,
      },
    },
  ],
});
