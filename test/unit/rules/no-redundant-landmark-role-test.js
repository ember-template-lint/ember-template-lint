'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/no-redundant-landmark-role');

const { createErrorMessage } = rule;

generateRuleTests({
  name: 'no-redundant-landmark-role',

  config: true,

  good: [
    '<form role="search"></form>',
    '<footer role="contentinfo"></footer>',
    '<footer role={{this.foo}}></footer>',
    '<footer role="{{this.stuff}}{{this.foo}}"></footer>',
  ],

  bad: [
    {
      template: '<header role="banner"></header>',
      result: {
        message: createErrorMessage('header', 'banner'),
        line: 1,
        column: 0,
        source: '<header role="banner"></header>',
      },
    },
    {
      template: '<main role="main"></main>',
      result: {
        message: createErrorMessage('main', 'main'),
        line: 1,
        column: 0,
        source: '<main role="main"></main>',
      },
    },
    {
      template: '<aside role="complementary"></aside>',
      result: {
        message: createErrorMessage('aside', 'complementary'),
        line: 1,
        column: 0,
        source: '<aside role="complementary"></aside>',
      },
    },
    {
      template: '<nav role="navigation"></nav>',
      result: {
        message: createErrorMessage('nav', 'navigation'),
        line: 1,
        column: 0,
        source: '<nav role="navigation"></nav>',
      },
    },
    {
      template: '<form role="form"></form>',
      result: {
        message: createErrorMessage('form', 'form'),
        line: 1,
        column: 0,
        source: '<form role="form"></form>',
      },
    },
  ],
});
