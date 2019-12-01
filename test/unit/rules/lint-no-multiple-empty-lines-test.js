'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-multiple-empty-lines',

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
        moduleId: 'layout.hbs',
        message: 'More than 1 blank line not allowed.',
        line: 2,
        column: 0,
        source: '\n\n',
      },
    },
    {
      template: '<div>foo</div>\n\n\n\n\n<div>bar</div>',

      result: {
        moduleId: 'layout.hbs',
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
        moduleId: 'layout.hbs',
        message: 'More than 3 blank lines not allowed.',
        line: 4,
        column: 0,
        source: '\n\n',
      },
    },
  ],
});
