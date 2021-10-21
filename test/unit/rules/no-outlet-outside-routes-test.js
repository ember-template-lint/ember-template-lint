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
        filePath: 'app/templates/foo/route.hbs',
      },
      result: {
        message,
        filePath: 'app/templates/foo/route.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{outlet}}',
      meta: {
        filePath: 'app/templates/routes/foo.hbs',
      },
      result: {
        message,
        filePath: 'app/templates/routes/foo.hbs',
        source: '{{outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#outlet}}Why?!{{/outlet}}',
      meta: {
        filePath: 'app/templates/foo/route.hbs',
      },
      result: {
        message,
        filePath: 'app/templates/foo/route.hbs',
        source: '{{#outlet}}Why?!{{/outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#outlet}}Why?!{{/outlet}}',
      meta: {
        filePath: 'app/templates/routes/foo.hbs',
      },
      result: {
        message,
        filePath: 'app/templates/routes/foo.hbs',
        source: '{{#outlet}}Why?!{{/outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#outlet}}Works because ambiguous{{/outlet}}',
      meta: {
        filePath: 'app/templates/something/foo.hbs',
      },
      result: {
        message,
        filePath: 'app/templates/something/foo.hbs',
        source: '{{#outlet}}Works because ambiguous{{/outlet}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{outlet}}',
      meta: {
        filePath: 'components/templates/application.hbs',
      },
      result: {
        message,
        filePath: 'components/templates/application.hbs',
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
        filePath: 'app/templates/components/foo/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "app/templates/components/foo/layout.hbs",
              "line": 1,
              "message": "Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.",
              "rule": "no-outlet-outside-routes",
              "severity": 2,
              "source": "{{outlet}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{outlet}}',

      meta: {
        filePath: 'app/templates/foo/-mything.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "app/templates/foo/-mything.hbs",
              "line": 1,
              "message": "Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.",
              "rule": "no-outlet-outside-routes",
              "severity": 2,
              "source": "{{outlet}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{outlet}}',

      meta: {
        filePath: 'app/components/foo/layout.hbs',
      },

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "app/components/foo/layout.hbs",
              "line": 1,
              "message": "Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.",
              "rule": "no-outlet-outside-routes",
              "severity": 2,
              "source": "{{outlet}}",
            },
          ]
        `);
      },
    },
  ],
});
