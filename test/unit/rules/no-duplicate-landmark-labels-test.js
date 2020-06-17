'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const rule = require('../../../lib/rules/no-duplicate-landmark-labels');

const { createErrorMessage } = rule;

generateRuleTests({
  name: 'no-duplicate-landmark-labels',

  config: true,

  good: [
    '<nav aria-label="primary site navigation"></nav><nav aria-label="secondary site navigation within home page"></nav>',
    '<nav aria-label="primary site navigation"></nav><div role="navigation" aria-label="secondary site navigation within home page"></div>',
    '<nav aria-label={{siteNavigation}}></nav><nav aria-label={{siteNavigation}}></nav>',
  ],

  bad: [
    {
      template: '<nav></nav><nav></nav>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('nav'),
        line: 1,
        column: 11,
        source: '<nav></nav>',
      },
    },
    {
      template: '<nav></nav><div role="navigation"></div>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('div'),
        line: 1,
        column: 11,
        source: '<div role="navigation"></div>',
      },
    },
    {
      template: '<main></main><div role="main"></div>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('div'),
        line: 1,
        column: 13,
        source: '<div role="main"></div>',
      },
    },
    {
      template: '<nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('nav'),
        line: 1,
        column: 40,
        source: '<nav aria-label="site navigation"></nav>',
      },
    },
    {
      template: '<form aria-label="search-form"></form><form aria-label="search-form"></form>',
      result: {
        moduleId: 'layout',
        message: createErrorMessage('form'),
        line: 1,
        column: 38,
        source: '<form aria-label="search-form"></form>',
      },
    },
  ],
});
