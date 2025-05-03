import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-model-argument-in-route-templates',

  config: true,
  meta: {
    filePath: 'app/templates/foo.hbs',
  },

  good: [
    '{{model}}',
    '{{this.model}}',
    '{{@modelythingy}}',
    {
      template: '{{@model}}',
      meta: {
        filePath: 'app/components/foo.hbs',
      },
    },
    {
      template: '{{@model}}',
      meta: {
        filePath: 'app/templates/components/foo.hbs',
      },
    },
  ],

  bad: [
    {
      template: '{{@model}}',
      fixedTemplate: '{{this.model}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "app/templates/foo.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Do not use \`{{@model}}\` in route templates, use \`{{this.model}}\` instead.",
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
          [
            {
              "column": 2,
              "endColumn": 12,
              "endLine": 1,
              "filePath": "app/templates/foo.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Do not use \`{{@model}}\` in route templates, use \`{{this.model}}\` instead.",
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
          [
            {
              "column": 2,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "app/templates/foo.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Do not use \`{{@model}}\` in route templates, use \`{{this.model}}\` instead.",
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
