'use strict';

const Rule = require('../../lib/rules/base');
const generateRuleTests = require('../helpers/rule-test-harness');

function verifyWithExternalSnapshot(results) {
  expect(results).toMatchSnapshot();
}

describe('rule public api', function() {
  describe('general test harness support', function() {
    generateRuleTests({
      plugins: [
        {
          name: 'test',
          rules: {
            'no-elements': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    this.log({
                      message: 'Do not use any HTML elements!',
                      line: node.loc && node.loc.start.line,
                      column: node.loc && node.loc.start.column,
                      source: this.sourceForNode(node),
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'no-elements',
      config: true,

      good: ['{{haha-wtf}}'],

      bad: [
        {
          name: 'uses static result - multiple',
          template: '<div></div><div></div>',
          results: [
            {
              column: 0,
              line: 1,
              message: 'Do not use any HTML elements!',
              source: '<div></div>',
            },
            {
              column: 11,
              line: 1,
              message: 'Do not use any HTML elements!',
              source: '<div></div>',
            },
          ],
        },
        {
          name: 'uses static result - multiple',
          template: '<div></div>',
          result: {
            column: 0,
            line: 1,
            message: 'Do not use any HTML elements!',
            source: '<div></div>',
          },
        },
        {
          name: 'can use verifyResults directly (with inline snapshots)',
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "filePath": "layout.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "moduleId": "layout",
                  "rule": "no-elements",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
        {
          name: 'can use verifyResults directly (with external snapshots)',
          template: '<div></div>',
          verifyResults: verifyWithExternalSnapshot,
        },
      ],
    });
  });
});
