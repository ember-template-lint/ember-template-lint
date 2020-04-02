'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const { makeErrorMessage } = require('../../../lib/rules/require-form-method');

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
      result: {
        message: makeErrorMessage('GET'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form method="POST"></form>',
      },
    },
    {
      config: {
        allowedMethods: ['POST'],
      },
      template: '<form method="GET"></form>',
      result: {
        message: makeErrorMessage('POST'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form method="GET"></form>',
      },
    },
    {
      template: '<form></form>',
      result: {
        message: makeErrorMessage('POST,GET,DIALOG'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form></form>',
      },
    },
    {
      template: '<form method=""></form>',
      result: {
        message: makeErrorMessage('POST,GET,DIALOG'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form method=""></form>',
      },
    },
    {
      template: '<form method=42></form>',
      result: {
        message: makeErrorMessage('POST,GET,DIALOG'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form method=42></form>',
      },
    },
    {
      template: '<form method=" ge t "></form>',
      result: {
        message: makeErrorMessage('POST,GET,DIALOG'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form method=" ge t "></form>',
      },
    },
    {
      template: '<form method=" pos t "></form>',
      result: {
        message: makeErrorMessage('POST,GET,DIALOG'),
        isFixable: false,
        line: 1,
        column: 0,
        source: '<form method=" pos t "></form>',
      },
    },
  ],
});
