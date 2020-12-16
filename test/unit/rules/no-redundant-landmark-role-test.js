'use strict';

const { createErrorMessage } = require('../../../lib/rules/no-redundant-landmark-role');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
      fixedTemplate: '<header></header>',

      result: {
        message: createErrorMessage('header', 'banner'),
        line: 1,
        column: 0,
        source: '<header role="banner"></header>',
        isFixable: true,
      },
    },
    {
      template: '<main role="main"></main>',
      fixedTemplate: '<main></main>',

      result: {
        message: createErrorMessage('main', 'main'),
        line: 1,
        column: 0,
        source: '<main role="main"></main>',
        isFixable: true,
      },
    },
    {
      template: '<aside role="complementary"></aside>',
      fixedTemplate: '<aside></aside>',

      result: {
        message: createErrorMessage('aside', 'complementary'),
        line: 1,
        column: 0,
        source: '<aside role="complementary"></aside>',
        isFixable: true,
      },
    },
    {
      template: '<nav role="navigation"></nav>',
      fixedTemplate: '<nav></nav>',

      result: {
        message: createErrorMessage('nav', 'navigation'),
        line: 1,
        column: 0,
        source: '<nav role="navigation"></nav>',
        isFixable: true,
      },
    },
    {
      template: '<form role="form"></form>',
      fixedTemplate: '<form></form>',

      result: {
        message: createErrorMessage('form', 'form'),
        line: 1,
        column: 0,
        source: '<form role="form"></form>',
        isFixable: true,
      },
    },
    {
      template: '<header role="banner" class="page-header"></header>',
      fixedTemplate: '<header class="page-header"></header>',

      result: {
        message: createErrorMessage('header', 'banner'),
        line: 1,
        column: 0,
        source: '<header role="banner" class="page-header"></header>',
        isFixable: true,
      },
    },
    {
      template: '<nav role="navigation" class="crumbs" id="id-nav-00"></nav>',
      fixedTemplate: '<nav class="crumbs" id="id-nav-00"></nav>',

      result: {
        message: createErrorMessage('nav', 'navigation'),
        line: 1,
        column: 0,
        source: '<nav role="navigation" class="crumbs" id="id-nav-00"></nav>',
        isFixable: true,
      },
    },
  ],
});
