'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/splat-attributes-only');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'splat-attributes-only',

  config: true,

  good: [
    '<div ...attributes></div>',
    '<div attributes></div>',
    '<div arguments></div>',
    '<div><div ...attributes></div></div>',
  ],

  bad: [
    {
      template: '<div ...arguments></div>',

      result: {
        message: ERROR_MESSAGE,
        source: '...arguments',
        line: 1,
        column: 5,
      },
    },
  ],
});
