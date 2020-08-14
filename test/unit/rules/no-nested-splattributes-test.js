'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-nested-splattributes');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
