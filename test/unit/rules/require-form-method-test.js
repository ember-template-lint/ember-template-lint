'use strict';

const { makeErrorMessage } = require('../../../lib/rules/require-form-method');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-form-method',

  config: true,

  good: [
    {
      config: {
        allowedMethods: ['get'],
      },
      template: '<form method="GET"></form>',
    },

    '<form method="POST"></form>',
    '<form method="post"></form>',
    '<form method="GET"></form>',
    '<form method="get"></form>',
    '<form method="DIALOG"></form>',
    '<form method="dialog"></form>',

    // dynamic values
    '<form method="{{formMethod}}"></form>',
    '<form method={{formMethod}}></form>',

    '<div/>',
    '<div></div>',
    '<div method="randomType"></div>',
  ],

  bad: [
    {
      config: {
        allowedMethods: ['get'],
      },
      template: '<form method="POST"></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`GET\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form method=\\"POST\\"></form>",
            },
          ]
        `);
      },
    },
    {
      config: {
        allowedMethods: ['POST'],
      },
      template: '<form method="GET"></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`POST\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form method=\\"GET\\"></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<form></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`POST,GET,DIALOG\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<form method=""></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`POST,GET,DIALOG\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form method=\\"\\"></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<form method=42></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`POST,GET,DIALOG\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form method=42></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<form method=" ge t "></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`POST,GET,DIALOG\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form method=\\" ge t \\"></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<form method=" pos t "></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "All \`<form>\` elements should have \`method\` attribute with value of \`POST,GET,DIALOG\`",
              "rule": "require-form-method",
              "severity": 2,
              "source": "<form method=\\" pos t \\"></form>",
            },
          ]
        `);
      },
    },
  ],
});
