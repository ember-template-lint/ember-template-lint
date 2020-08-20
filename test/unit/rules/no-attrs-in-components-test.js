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
        moduleId: 'app/templates/index.hbs',
      },
    },
    {
      template: '{{attrs.foo}}',
      meta: {
        moduleId: 'app/templates/my-components/index.hbs',
      },
    },
  ],
  bad: [
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/components/foo.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/components/foo.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/components/nested/foo.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/components/nested/foo.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/components/nested/foo/template.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/components/nested/foo/template.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/ui/components/foo.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/ui/components/foo.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/foo/-components/bar.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/foo/-components/bar.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '<div class={{attrs.foo}}></div>',

      meta: {
        moduleId: 'app/templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 13,
      },
    },
    {
      template: '{{#if attrs.foo}}bar{{/if}}',

      meta: {
        moduleId: 'app/templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 6,
      },
    },
    {
      template: '{{bar foo=attrs.foo}}',

      meta: {
        moduleId: 'app/templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 10,
      },
    },
    {
      template: '{{component attrs.foo}}',

      meta: {
        moduleId: 'app/templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 12,
      },
    },
    {
      template: '{{bar/baz (hash foo=attrs.foo)}}',

      meta: {
        moduleId: 'app/templates/components/layout.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/templates/components/layout.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 20,
      },
    },
    {
      template: '{{attrs.foo}}',

      meta: {
        moduleId: 'app/components/comment/template.hbs',
      },

      result: {
        rule: 'no-attrs-in-components',
        message: 'Component templates should not contain `attrs`.',
        moduleId: 'app/components/comment/template.hbs',
        source: 'attrs.foo',
        line: 1,
        column: 2,
      },
    },
  ],
});
