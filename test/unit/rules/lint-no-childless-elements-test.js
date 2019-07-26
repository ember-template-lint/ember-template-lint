'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const rule = require('../../../lib/rules/lint-no-childless-elements');

const { ALLOWED_CHILDLESS_TAGS, ERROR_MESSAGE } = rule;

generateRuleTests({
  name: 'no-childless-elements',

  config: true,

  good: [
    ...ALLOWED_CHILDLESS_TAGS.map(blockTag => {
      return {
        template: `<${blockTag}>`,
      };
    }),
    {
      template: `<div></div>`,
      config: {
        allow: ['div'],
      },
    },
  ],

  bad: [
    ...ALLOWED_CHILDLESS_TAGS.map(blockTag => {
      return {
        template: `<${blockTag}>`,
        config: {
          block: ALLOWED_CHILDLESS_TAGS,
        },

        result: {
          message: ERROR_MESSAGE,
          moduleId: 'layout.hbs',
          source: `<${blockTag}>`,
          line: 1,
          column: 0,
        },
      };
    }),
    {
      template: `<div></div>`,
      config: {
        block: ['div'],
      },

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: `<div></div>`,
        line: 1,
        column: 0,
      },
    },
  ],
});
