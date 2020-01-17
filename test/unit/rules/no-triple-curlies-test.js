'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-triple-curlies',

  config: true,

  good: [
    '{{foo}}',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
    '{{! template-lint-disable no-triple-curlies}}{{{lol}}}',
  ],

  bad: [
    {
      template: '\n {{{foo}}}',

      result: {
        message: 'Usage of triple curly brackets is unsafe',
        moduleId: 'layout.hbs',
        source: '{{{foo}}}',
        line: 2,
        column: 1,
      },
    },
  ],
});
