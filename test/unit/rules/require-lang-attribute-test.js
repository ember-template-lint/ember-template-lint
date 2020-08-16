'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/require-lang-attribute');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-lang-attribute',

  config: true,

  good: ['<html lang="en"></html>', '<html lang="en-US"></html>', '<html lang={{lang}}></html>'],

  bad: [
    {
      template: '<html></html>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<html></html>',
      },
    },
    {
      template: '<html lang=""></html>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: '<html lang=""></html>',
      },
    },
  ],
});
