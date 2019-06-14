'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const rule = require('../../../lib/rules/lint-no-childless-elements');

const { BLOCK_TAGS, ERROR_MESSAGE } = rule;

generateRuleTests({
  name: 'no-childless-elements',

  config: true,

  good: BLOCK_TAGS.map(blockTag => {
    return `<${blockTag}>Something</${blockTag}>`;
  }),

  bad: BLOCK_TAGS.map(blockTag => {
    return {
      template: `<${blockTag}></${blockTag}>`,

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: `<${blockTag}></${blockTag}>`,
        line: 1,
        column: 0,
      },
    };
  }),
});
