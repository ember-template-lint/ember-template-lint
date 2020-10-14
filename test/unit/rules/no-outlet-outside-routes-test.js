'use strict';

const { message } = require('../../../lib/rules/no-outlet-outside-routes');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-outlet-outside-routes',

  config: true,

  good: [
    '{{foo}}',
    '{{button}}',
    {
      template: '{{outlet}}',
      meta: {
        moduleId: 'app/templates/foo/route.hbs',
      },
      result: {
        message,
        moduleId: 'foo/route.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{outlet}}',
      meta: {
        moduleId: 'app/templates/routes/foo.hbs',
      },
      result: {
        message,
        moduleId: 'routes/foo.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#outlet}}Why?!{{/outlet}}',
      meta: {
        moduleId: 'app/templates/foo/route.hbs',
      },
      result: {
        message,
        moduleId: 'app/templates/foo/route.hbs',
        source: '{{#outlet}}Why?!{{/outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#outlet}}Why?!{{/outlet}}',
      meta: {
        moduleId: 'routes/foo.hbs',
      },
      result: {
        message,
        moduleId: 'app/templates/routes/foo.hbs',
        source: '{{#outlet}}Why?!{{/outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#outlet}}Works because ambiguous{{/outlet}}',
      meta: {
        moduleId: 'app/templates/something/foo.hbs',
      },
      result: {
        message,
        moduleId: 'something/foo.hbs',
        source: '{{#outlet}}Works because ambiguous{{/outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{outlet}}',
      meta: {
        moduleId: 'components/templates/application.hbs',
      },
      result: {
        message,
        moduleId: 'components/templates/application.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
  ],
  bad: [
    {
      template: '{{outlet}}',

      meta: {
        moduleId: 'app/templates/components/foo/layout.hbs',
      },

      result: {
        message,
        moduleId: 'app/templates/components/foo/layout.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{outlet}}',

      meta: {
        moduleId: 'app/templates/foo/-mything.hbs',
      },

      result: {
        message,
        moduleId: 'app/templates/foo/-mything.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{outlet}}',

      meta: {
        moduleId: 'app/components/foo/layout.hbs',
      },

      result: {
        message,
        moduleId: 'app/components/foo/layout.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
