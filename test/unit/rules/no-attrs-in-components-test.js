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

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '<div class={{attrs.foo}}></div>',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{#if attrs.foo}}bar{{/if}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 6,
      },
    },
    {
      template: '{{bar foo=attrs.foo}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 10,
      },
    },
    {
      template: '{{component attrs.foo}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 12,
      },
    },
    {
      template: '{{bar/baz (hash foo=attrs.foo)}}',

      meta: {
        filePath: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 20,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        filePath: 'components/comment/template.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        filePath: 'components/comment/template.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
  ],
});
