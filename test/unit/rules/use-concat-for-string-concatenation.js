'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'use-concat-for-string-concatenation',

  config: true,

  good: [
    '<div class={{concat "flex-" (if this.show "100" "50")}}></div>',
    '<div id={{concat "input-" this.inputId}}></div>',
  ],

  bad: [
    {
      template: '<a href="https://myurl.com?{{this.queryParams}}">click here</a>',
      result: {
        message: 'Found string concatenation without {{concat}} helper',
        source: '<a href="https://myurl.com?{{this.queryParams}}">click here</a>',
        line: 1,
        column: 4,
      },
    },
  ],
});
