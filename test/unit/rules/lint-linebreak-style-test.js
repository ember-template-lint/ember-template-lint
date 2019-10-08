'use strict';

const os = require('os');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'linebreak-style',

  config: true,

  good: [
    'testing this',
    'testing \n this',
    'testing \r\n this',
    {
      config: 'system',
      template: os.EOL === '\n' ? 'testing\nthis' : 'testing\r\nthis',
    },
    {
      config: 'windows',
      template: 'testing\r\nthis',
    },
    {
      config: 'unix',
      template: 'testing\nthis',
    },
  ],

  bad: [
    {
      template: 'something\ngoes\r\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 2,
        column: 4,
        source: '\r\n',
      },
    },
    {
      config: 'unix',
      template: '\r\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 0,
        source: '\r\n',
      },
    },
    {
      config: 'unix',
      template: '{{#if test}}\r\n{{/if}}',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 12,
        source: '\r\n',
      },
    },
    {
      config: 'unix',
      template: '{{blah}}\r\n{{blah}}',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 8,
        source: '\r\n',
      },
    },
    {
      config: 'unix',
      template: '{{blah}}\r\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 8,
        source: '\r\n',
      },
    },
    {
      config: 'unix',
      template: '{{blah arg="\r\n"}}',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 12,
        source: '\r\n',
      },
    },
    {
      config: 'unix',
      template: '<blah arg="\r\n" />',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 11,
        source: '\r\n',
      },
    },
    {
      config: 'windows',
      template: '\n',

      result: {
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected CRLF but found LF',
        line: 1,
        column: 0,
        source: '\n',
      },
    },
  ],
});
