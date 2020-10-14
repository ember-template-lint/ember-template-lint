'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-trailing-spaces',

  config: true,

  good: [
    'test',
    'test\n',
    'test\n' + '\n',
    // test the re-entering of yielded content
    '{{#my-component}}\n' + '  test\n' + '{{/my-component}}',
  ],

  bad: [
    {
      template: 'test ',

      result: {
        message: 'line cannot end with space',
        line: 1,
        column: 4,
        source: 'test ',
      },
    },
    {
      template: 'test \n',

      result: {
        message: 'line cannot end with space',
        line: 1,
        column: 4,
        source: 'test ',
      },
    },
    {
      template: 'test\n' + ' \n',

      result: {
        message: 'line cannot end with space',
        line: 2,
        column: 0,
        source: ' ',
      },
    },
    // test the re-entering of yielded content
    // only generates one error instead of two
    {
      template: '{{#my-component}}\n' + '  test \n' + '{{/my-component}}',

      result: {
        message: 'line cannot end with space',
        line: 2,
        column: 6,
        source: '  test ',
      },
    },
  ],
});
