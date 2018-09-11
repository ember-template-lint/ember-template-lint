'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/lint-no-outlet-outside-routes').message;

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
        moduleId: 'app/templates/foo/route.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{#outlet}}Route with "components" name{{/outlet}}',
      meta: {
        moduleId: 'app/templates/components.hbs',
      },
      result: {
        message,
        moduleId: 'app/templates/components.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{outlet}}',
      meta: {
        moduleId: 'app/templates/routes/foo.hbs'
      },
      result: {
        message,
        moduleId: 'app/templates/routes/foo.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{#outlet}}Why?!{{/outlet}}',
      meta: {
        moduleId: 'app/templates/foo/route.hbs'
      },
      result: {
        message,
        moduleId: 'app/templates/foo/route.hbs',
        source: '{{#outlet}}Why?!{{/outlet}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{#outlet}}Why?!{{/outlet}}',
      meta: {
        moduleId: 'app/templates/routes/foo.hbs'
      },
      result: {
        message,
        moduleId: 'app/templates/routes/foo.hbs',
        source: '{{#outlet}}Why?!{{/outlet}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{#outlet}}Works because ambiguous{{/outlet}}',
      meta: {
        moduleId: 'app/templates/something/foo.hbs'
      },
      result: {
        message,
        moduleId: 'app/templates/something/foo.hbs',
        source: '{{#outlet}}Works because ambiguous{{/outlet}}',
        line: 1,
        column: 0
      }
    }
  ],
  bad: [
    {
      template: '{{outlet}}',

      meta: {
        moduleId: 'app/templates/components/foo/layout.hbs'
      },

      result: {
        message,
        moduleId: 'app/templates/components/foo/layout.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0
      }
    },
    {
      template: '{{outlet}}',

      meta: {
        moduleId: 'app/templates/foo/-mything.hbs'
      },

      result: {
        message,
        moduleId: 'app/templates/foo/-mything.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0
      }
    },
  ],

});
