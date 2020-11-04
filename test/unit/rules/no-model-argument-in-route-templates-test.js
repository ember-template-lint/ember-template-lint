'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-model-argument-in-route-templates',

  config: true,
  meta: {
    filePath: 'app/templates/foo.hbs',
    moduleId: 'app/templates/foo',
  },

  good: [
    '{{model}}',
    '{{this.model}}',
    '{{@modelythingy}}',
    {
      template: '{{@model}}',
      meta: {
        filePath: 'app/components/foo.hbs',
        moduleId: 'app/components/foo',
      },
    },
    {
      template: '{{@model}}',
      meta: {
        filePath: 'app/templates/components/foo.hbs',
        moduleId: 'app/templates/components/foo',
      },
    },
  ],

  bad: [
    {
      template: '{{@model}}',
      fixedTemplate: '{{this.model}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "app/templates/foo.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Do not use \`{{@model}}\` in route templates, use \`{{this.model}}\` instead.",
              "moduleId": "app/templates/foo",
              "rule": "no-model-argument-in-route-templates",
              "severity": 2,
              "source": "@model",
            },
          ]
        `);
      },
    },
    {
      template: '{{@model.foo}}',
      fixedTemplate: '{{this.model.foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "app/templates/foo.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Do not use \`{{@model}}\` in route templates, use \`{{this.model}}\` instead.",
              "moduleId": "app/templates/foo",
              "rule": "no-model-argument-in-route-templates",
              "severity": 2,
              "source": "@model.foo",
            },
          ]
        `);
      },
    },
    {
      template: '{{@model.foo.bar}}',
      fixedTemplate: '{{this.model.foo.bar}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "app/templates/foo.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Do not use \`{{@model}}\` in route templates, use \`{{this.model}}\` instead.",
              "moduleId": "app/templates/foo",
              "rule": "no-model-argument-in-route-templates",
              "severity": 2,
              "source": "@model.foo.bar",
            },
          ]
        `);
      },
    },
  ],
});
