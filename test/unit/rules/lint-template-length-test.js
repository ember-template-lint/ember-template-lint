'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'template-length',

  config: true,

  good: [
    'testing this',
    'testing \n this',
    {
      config: {max: 10},
      template: 'testing\nthis\n'
    },
    {
      config: {min: 1},
      template: 'testing\nthis\nand\this\n'
    },
    {
      config: {min: 1, max: 5},
      template: 'testing\nthis\nandthis\n'
    },
  ],

  bad: [
    {
      config: {min: 10},
      template: 'testing\ntoo-short template\n',

      result: {
        rule: 'template-length',
        moduleId: 'layout.hbs',
        message: 'Template length of 3 is smaller than 10',
        line: 1,
        column: 0,
      }
    },
    {
      config: {max: 3},
      template: 'test\nthis\nand\nthis\n',

      result: {
        rule: 'template-length',
        moduleId: 'layout.hbs',
        message: 'Template length of 5 exceeds 3',
        line: 1,
        column: 0,
      }
    /*
    },
    {
      config: true,
      template: Array(200).fill().map('test this\n').join(),

      result: {
        rule: 'template-length',
        moduleId: 'layout.hbs',
        message: 'Wrong linebreak used. Expected LF but found CRLF',
        line: 1,
        column: 8,
        source: '\r\n'
      }
      */
    }
  ]
});
