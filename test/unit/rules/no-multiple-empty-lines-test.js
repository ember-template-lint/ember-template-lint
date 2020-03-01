'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { parseConfig, CONFIG_ERROR_MESSAGE } = require('../../../lib/rules/no-multiple-empty-lines');

generateRuleTests({
  name: 'no-multiple-empty-lines',

  config: true,

  good: [
    '<div>foo</div><div>bar</div>',
    '<div>foo</div><div>bar</div>',
    '<div>foo</div>\n<div>bar</div>',
    '<div>foo</div>\r\n<div>bar</div>',
    '<div>foo</div>\n\n<div>bar</div>',
    '<div>foo</div>\r\n\r\n<div>bar</div>',
    '\n<div>foo</div>\n\n<div>bar</div>\n',
    {
      config: { max: 2 },
      template: '<div>foo</div>\n\n\n<div>bar</div>',
    },
    {
      config: { max: 2 },
      template: '<div>foo</div>\r\n\r\n\r\n<div>bar</div>',
    },
  ],

  bad: [
    {
      template: '<div>foo</div>\n\n\n<div>bar</div>',

      result: {
        message: 'More than 1 blank line not allowed.',
        line: 2,
        column: 0,
        source: '\n\n',
      },
    },
    {
      template: '<div>foo</div>\n\n\n\n\n<div>bar</div>',

      result: {
        message: 'More than 1 blank line not allowed.',
        line: 2,
        column: 0,
        source: '\n\n\n\n',
      },
    },
    {
      config: { max: 3 },

      template: '<div>foo</div>\n\n\n\n\n<div>bar</div>',

      result: {
        message: 'More than 3 blank lines not allowed.',
        line: 4,
        column: 0,
        source: '\n\n',
      },
    },
  ],
});

describe('no-multiple-empty-lines', () => {
  describe('parseConfig', () => {
    const TESTS = [
      [true, { max: 1 }],
      [{ max: 1 }, { max: 1 }],
      [{ max: 2 }, { max: 2 }],
      [{ max: 42, foo: 'bar' }, { max: 42 }],
    ];

    for (let [input, expected] of TESTS) {
      test(`${JSON.stringify(input)} -> ${JSON.stringify(expected)}`, () => {
        expect(parseConfig(input)).toEqual(expected);
      });
    }

    const FAILURE_TESTS = [undefined, false, {}, { foo: 'bar' }, { max: 'foo' }];

    for (let input of FAILURE_TESTS) {
      test(`${JSON.stringify(input)} -> Error`, () => {
        expect(() => parseConfig(input)).toThrow(CONFIG_ERROR_MESSAGE);
      });
    }
  });
});
