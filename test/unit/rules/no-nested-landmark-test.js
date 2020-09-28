'use strict';

const rule = require('../../../lib/rules/no-nested-landmark');
const generateRuleTests = require('../../helpers/rule-test-harness');

const { createErrorMessage } = rule;

generateRuleTests({
  name: 'no-nested-landmark',

  config: true,

  good: [
    '<div><main></main></div>',
    '<div role="application"><div role="document"><div role="application"></div></div></div>',
    '<footer><nav></nav></footer>', // nested landmarks of different types are okay
    '<div role="footer"><nav></nav></div>',
    '<footer><div role="navigation"></div></footer>',
    '<div role="footer"><div role="navigation"></div></div>',
  ],

  bad: [
    {
      template: '<main><main></main></main>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 6,
        source: '<main></main>',
      },
    },
    {
      template: '<main><div><main></main></div></main>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 11,
        source: '<main></main>',
      },
    },

    {
      template: '<div role="main"><main></main></div>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 17,
        source: '<main></main>',
      },
    },
    {
      template: '<div role="main"><div><main></main></div></div>',
      result: {
        message: createErrorMessage('main'),
        line: 1,
        column: 22,
        source: '<main></main>',
      },
    },

    {
      template: '<main><div role="main"></div></main>',
      result: {
        message: createErrorMessage('div'),
        line: 1,
        column: 6,
        source: '<div role="main"></div>',
      },
    },
    {
      template: '<main><div><div role="main"></div></div></main>',
      result: {
        message: createErrorMessage('div'),
        line: 1,
        column: 11,
        source: '<div role="main"></div>',
      },
    },
    {
      template: '<nav><nav></nav></nav>',
      result: {
        message: createErrorMessage('nav'),
        line: 1,
        column: 5,
        source: '<nav></nav>',
      },
    },
    {
      template: '<header><header></header></header>',
      result: {
        message: createErrorMessage('header'),
        line: 1,
        column: 8,
        source: '<header></header>',
      },
    },
    {
      template: '<header><div role="banner"></div></header>',
      result: {
        message: createErrorMessage('div'),
        line: 1,
        column: 8,
        source: '<div role="banner"></div>',
      },
    },
    {
      template: '<div role="contentinfo"><footer></footer></div>',
      result: {
        message: createErrorMessage('footer'),
        line: 1,
        column: 24,
        source: '<footer></footer>',
      },
    },
  ],
});
