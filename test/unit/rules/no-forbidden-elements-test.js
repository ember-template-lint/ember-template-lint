'use strict';

const { ERROR_MESSAGE_FORBIDDEN_ELEMENTS } = require('../../../lib/rules/no-forbidden-elements');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-forbidden-elements',

  config: true,

  good: [
    '<header></header>',
    '<div></div>',
    '<footer></footer>',
    '<p></p>',
    '<head><meta charset="utf-8"></head>',
    {
      template: '<script></script>',
      config: ['html', 'meta', 'style'],
    },
    {
      template: '<meta>',
      meta: {
        filePath: 'app/templates/head.hbs',
      },
    },
  ],
  bad: [
    {
      template: '<script></script>',
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('script'),
        line: 1,
        column: 0,
        source: '<script></script>',
      },
    },
    {
      template: '<html></html>',
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('html'),
        line: 1,
        column: 0,
        source: '<html></html>',
      },
    },
    {
      template: '<style></style>',
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('style'),
        line: 1,
        column: 0,
        source: '<style></style>',
      },
    },
    {
      template: '<meta charset="utf-8">',
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('meta'),
        line: 1,
        column: 0,
        source: '<meta charset="utf-8">',
      },
    },
    {
      template: '<div></div>',
      config: {
        forbidden: ['div'],
      },
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('div'),
        line: 1,
        column: 0,
        source: '<div></div>',
      },
    },
    {
      template: '<div></div>',
      config: ['div'],
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('div'),
        line: 1,
        column: 0,
        source: '<div></div>',
      },
    },
    {
      template: '<Foo />',
      config: ['Foo'],
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('Foo'),
        line: 1,
        column: 0,
        source: '<Foo />',
      },
    },
    {
      template: '<script></script>',
      meta: {
        filePath: 'app/templates/head.hbs',
      },
      result: {
        filePath: 'app/templates/head.hbs',
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('script'),
        line: 1,
        column: 0,
        source: '<script></script>',
      },
    },
    {
      template: '<html></html>',
      meta: {
        filePath: 'app/templates/head.hbs',
      },
      result: {
        filePath: 'app/templates/head.hbs',
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('html'),
        line: 1,
        column: 0,
        source: '<html></html>',
      },
    },
    {
      template: '<head><html></html></head>',
      result: {
        message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS('html'),
        line: 1,
        column: 6,
        source: '<html></html>',
      },
    },
  ],
});
