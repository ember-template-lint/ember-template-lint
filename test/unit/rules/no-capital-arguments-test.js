'use strict';

const {
  ERROR_MESSAGE_CAPITAL,
  ERROR_MESSAGE_RESERVED,
} = require('../../../lib/rules/no-capital-arguments');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-capital-arguments',

  config: true,

  good: ['<Foo @name="bar" />', '@foo'],

  bad: [
    {
      template: '<Foo @Name="bar" />',
      result: {
        message: ERROR_MESSAGE_CAPITAL,
        line: 1,
        column: 5,
        source: 'Name',
      },
    },
    {
      template: '<Foo @_ame="bar" />',
      result: {
        message: ERROR_MESSAGE_CAPITAL,
        line: 1,
        column: 5,
        source: '_ame',
      },
    },
    {
      template: '{{@Name}}',
      result: {
        message: ERROR_MESSAGE_CAPITAL,
        line: 1,
        column: 3,
        source: 'Name',
      },
    },
    {
      template: '{{@_Name}}',
      result: {
        message: ERROR_MESSAGE_CAPITAL,
        line: 1,
        column: 3,
        source: '_Name',
      },
    },

    ...['@arguments', '@args', '@block', '@else'].map((el) => {
      return {
        template: `{{${el}}}`,
        result: {
          message: ERROR_MESSAGE_RESERVED(el),
          line: 1,
          column: 3,
          source: el.slice(1),
        },
      };
    }),

    ...['@arguments', '@args', '@block', '@else'].map((el) => {
      return {
        template: `<MyComponent ${el}={{42}} />`,
        result: {
          message: ERROR_MESSAGE_RESERVED(el),
          line: 1,
          column: 13,
          source: el.slice(1),
        },
      };
    }),
  ],
});
