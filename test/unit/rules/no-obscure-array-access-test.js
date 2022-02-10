import { ERROR_MESSAGE } from '../../../lib/rules/no-obscure-array-access.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

const RULE_NAME = 'no-obscure-array-access';
generateRuleTests({
  name: RULE_NAME,

  config: true,

  good: [
    "{{foo bar=(get this.list '0' )}}",
    "<Foo @bar={{get this.list '0'}}",
    "{{get this.list '0'}}",
    '{{foo bar @list}}',
    'Just a regular text in the template bar.[1] bar.1',
    '<Foo foo="bar.[1]" />',
  ],

  bad: [
    {
      template: '{{foo bar=this.list.[0]}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "${ERROR_MESSAGE('this.list.0')}",
              "rule": "${RULE_NAME}",
              "severity": 2,
              "source": "this.list.0",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo bar @list.[1]}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "${ERROR_MESSAGE('@list.1')}",
              "rule": "${RULE_NAME}",
              "severity": 2,
              "source": "@list.1",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.[0]}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "${ERROR_MESSAGE('this.list.0')}",
              "rule": "${RULE_NAME}",
              "severity": 2,
              "source": "this.list.0",
            },
          ]
        `);
      },
    },
    {
      template: '{{this.list.[0].name}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "${ERROR_MESSAGE('this.list.0.name')}",
              "rule": "${RULE_NAME}",
              "severity": 2,
              "source": "this.list.0.name",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @bar={{this.list.[0]}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "${ERROR_MESSAGE('this.list.0')}",
              "rule": "${RULE_NAME}",
              "severity": 2,
              "source": "this.list.0",
            },
          ]
        `);
      },
    },
  ],
});
