'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-nested-splattributes').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-nested-splattributes',

  config: true,

  good: [
    '<div>...</div>',
    '<div><div ...attributes>...</div></div>',
    '<div ...attributes>...</div>',
    '<div ...attributes>...</div><div ...attributes>...</div>',
  ],

  bad: [
    {
      template:
        '<div ...attributes>\n' +
        '  <div ...attributes>\n' +
        '    ...\n' +
        '  </div>\n' +
        '</div>\n',
      result: {
        message: ERROR_MESSAGE,
        line: 2,
        column: 7,
        source: '...attributes',
      },
    },
    {
      template:
        '<div ...attributes>\n' +
        '  <div>\n' +
        '    <div ...attributes>\n' +
        '    ...\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n',
      result: {
        message: ERROR_MESSAGE,
        line: 3,
        column: 9,
        source: '...attributes',
      },
    },
  ],
});
