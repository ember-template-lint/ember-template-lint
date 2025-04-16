import { parseConfig, CONFIG_ERROR_MESSAGE } from '../../../lib/rules/no-multiple-empty-lines.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-multiple-empty-lines',

  config: true,

  good: [
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
      fixedTemplate: '<div>foo</div>\n\n<div>bar</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 14,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "More than 1 blank line not allowed.",
              "rule": "no-multiple-empty-lines",
              "severity": 2,
              "source": "

          ",
            },
          ]
        `);
      },
    },
    {
      template: '<div>foo</div>\n\n\n\n\n<div>bar</div>',
      fixedTemplate: '<div>foo</div>\n\n<div>bar</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 14,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "More than 1 blank line not allowed.",
              "rule": "no-multiple-empty-lines",
              "severity": 2,
              "source": "



          ",
            },
          ]
        `);
      },
    },
    {
      config: { max: 3 },

      template: '<div>foo</div>\n\n\n\n\n<div>bar</div>',
      fixedTemplate: '<div>foo</div>\n\n\n\n<div>bar</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 14,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "More than 3 blank lines not allowed.",
              "rule": "no-multiple-empty-lines",
              "severity": 2,
              "source": "

          ",
            },
          ]
        `);
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
