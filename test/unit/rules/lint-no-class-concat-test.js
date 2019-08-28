'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { ERROR_MESSAGE } = require('../../../lib/rules/lint-no-class-concat');

generateRuleTests({
  name: 'no-class-concat',

  config: true,

  good: ['<img>', '<img class="foo">'],

  bad: [
    {
      template: '<div class="{{concat "pv2 " headerClasses}}"></div>',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: 'class="{{concat "pv2 " headerClasses}}"',
        line: 1,
        column: 5,
      },
    },
  ],
});
