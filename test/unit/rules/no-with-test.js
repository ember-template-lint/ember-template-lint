'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-with');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-with',

  config: true,

  good: [
    '{{@with}}',
    '{{this.with}}',
    '{{with "foo" bar="baz"}}',
    '{{#if @model.posts}}{{@model.posts}}{{/if}}',
    '{{#let @model.posts as |blogPosts|}}{{blogPosts}}{{/let}}',
    '{{#each @model.posts as |blogPost|}}{{blogPost}}{{/each}}',
    '{{foo-bar}}',
    '{{foo-bar baz="qux"}}',
    '{{false}}',
    '{{true}}',
    '{{null}}',
    '{{undefined}}',
    '{{100}}',
    '{{"foo-bar"}}',
  ],

  bad: [
    {
      template: '{{#with this.foo as |bar|}}{{bar}}{{/with}}',

      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '{{#with this.foo as |bar|}}{{bar}}{{/with}}',
      },
    },
    {
      template:
        '{{#with (hash firstName="John" lastName="Doe") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}',

      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source:
          '{{#with (hash firstName="John" lastName="Doe") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}',
      },
    },
  ],
});
