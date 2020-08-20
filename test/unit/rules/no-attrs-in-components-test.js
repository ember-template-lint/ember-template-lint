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
    {
      template: '{{attrs.foo}}',
      meta: {
        moduleId: '/templates/foo.hbs',
      },
    },
  ],
  bad: [
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'components/foo.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'components/foo.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'components/nested/foo.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'components/nested/foo.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'components/nested/foo/template.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'components/nested/foo/template.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'ui/components/foo.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'ui/components/foo.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'foo/-components/bar.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'foo/-components/bar.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '<div class={{attrs.foo}}></div>',

      meta: {
        moduleId: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{#if attrs.foo}}bar{{/if}}',

      meta: {
        moduleId: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 6,
      },
    },
    {
      template: '{{bar foo=attrs.foo}}',

      meta: {
        moduleId: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 10,
      },
    },
    {
      template: '{{component attrs.foo}}',

      meta: {
        moduleId: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 12,
      },
    },
    {
      template: '{{bar/baz (hash foo=attrs.foo)}}',

      meta: {
        moduleId: 'templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 20,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'components/comment/template.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'components/comment/template.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
  ],
});
