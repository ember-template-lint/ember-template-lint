'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-duplicate-landmark-elements');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-duplicate-landmark-elements',

  config: true,

  good: [
    '<nav aria-label="primary site navigation"></nav><nav aria-label="secondary site navigation within home page"></nav>',
    '<nav aria-label="primary site navigation"></nav><div role="navigation" aria-label="secondary site navigation within home page"></div>',
    '<nav aria-label={{siteNavigation}}></nav><nav aria-label={{siteNavigation}}></nav>',
    // since we can't confirm what the role of the div is, we have to let it pass
    '<nav aria-label="primary site navigation"></nav><div role={{role}} aria-label="secondary site navigation within home page"></div>',
    '<form aria-labelledby="form-title"><div id="form-title">Shipping Address</div></form><form aria-label="meaningful title of second form"></form>',
    '<form role="search"></form><form></form>',
    '<header></header><main></main><footer></footer>',
    '<nav aria-label="primary navigation"></nav><nav aria-label={{this.something}}></nav>',
    '<img role="none"><img role="none">',
  ],

  bad: [
    {
      template: '<nav></nav><nav></nav>',
      result: {
        message: ERROR_MESSAGE,
        source: '<nav></nav>',
        line: 1,
        column: 11,
      },
    },
    {
      template: '<nav></nav><div role="navigation"></div>',
      result: {
        message: ERROR_MESSAGE,
        source: '<div role="navigation"></div>',
        line: 1,
        column: 11,
      },
    },
    {
      template: '<nav></nav><nav aria-label="secondary navigation"></nav>',
      result: {
        message: ERROR_MESSAGE,
        source: '<nav></nav>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<main></main><div role="main"></div>',
      result: {
        message: ERROR_MESSAGE,
        source: '<div role="main"></div>',
        line: 1,
        column: 13,
      },
    },
    {
      template: '<nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav>',
      result: {
        message: ERROR_MESSAGE,
        source: '<nav aria-label="site navigation"></nav>',
        line: 1,
        column: 40,
      },
    },
    {
      template: '<form aria-label="search-form"></form><form aria-label="search-form"></form>',
      result: {
        message: ERROR_MESSAGE,
        source: '<form aria-label="search-form"></form>',
        line: 1,
        column: 38,
      },
    },
    {
      template:
        '<form aria-labelledby="form-title"></form><form aria-labelledby="form-title"></form>',
      result: {
        message: ERROR_MESSAGE,
        source: '<form aria-labelledby="form-title"></form>',
        line: 1,
        column: 42,
      },
    },
  ],
});
