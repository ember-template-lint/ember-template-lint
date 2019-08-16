'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const rule = require('../../../lib/rules/lint-no-childless-elements');

const { ALLOWED_CHILDLESS_TAGS, ERROR_MESSAGE, BASE_BLOCK_ELEMENT } = rule;

const _renderTagTemplate = tag => {
  return BASE_BLOCK_ELEMENT.includes(tag) ? `<${tag}></${tag}>` : `<${tag}>`;
};

generateRuleTests({
  name: 'no-childless-elements',

  config: true,

  good: [
    ...ALLOWED_CHILDLESS_TAGS.map(blockTag => {
      return {
        template: _renderTagTemplate(blockTag),
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
        template: _renderTagTemplate(blockTag),
        config: {
          block: ALLOWED_CHILDLESS_TAGS,
        },

        result: {
          message: ERROR_MESSAGE,
          moduleId: 'layout.hbs',
          source: _renderTagTemplate(blockTag),
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
