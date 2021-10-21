'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-extra-mut-helper-argument');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-extra-mut-helper-argument',

  config: true,

  good: [
    '{{my-component click=(action (mut isClicked))}}',
    '{{my-component click=(action (mut isClicked) true)}}',
    '{{my-component isClickedMutable=(mut isClicked)}}',
    '<button {{action (mut isClicked)}}></button>',
    '<button {{action (mut isClicked) true}}></button>',
  ],

  bad: [
    {
      template: '{{my-component click=(action (mut isClicked true))}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 29,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The handlebars \`mut(attr)\` helper should only have one argument passed to it. To pass a value, use: \`(action (mut attr) value)\`.",
              "rule": "no-extra-mut-helper-argument",
              "severity": 2,
              "source": "(mut isClicked true)",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component isClickedMutable=(mut isClicked true)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 32,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The handlebars \`mut(attr)\` helper should only have one argument passed to it. To pass a value, use: \`(action (mut attr) value)\`.",
              "rule": "no-extra-mut-helper-argument",
              "severity": 2,
              "source": "(mut isClicked true)",
            },
          ]
        `);
      },
    },
    {
      template: '<button {{action (mut isClicked true)}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 17,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The handlebars \`mut(attr)\` helper should only have one argument passed to it. To pass a value, use: \`(action (mut attr) value)\`.",
              "rule": "no-extra-mut-helper-argument",
              "severity": 2,
              "source": "(mut isClicked true)",
            },
          ]
        `);
      },
    },
  ],
});
