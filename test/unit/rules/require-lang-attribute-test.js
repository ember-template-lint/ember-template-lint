'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/require-lang-attribute').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-lang-attribute',

  config: true,

  good: ['<html lang="en"></html>', '<html lang="en-US"></html>'],

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
  ],
});
