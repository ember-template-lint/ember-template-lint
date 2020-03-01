'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-implicit-this').message;

let statements = [
  path => `{{${path}}}`,
  path => `{{${path} argument=true}}`,
  path => `{{#${path}}}{{/${path}}}`,
  path => `{{helper argument=${path}}}`,
  path => `{{#helper argument=${path}}}{{/helper}}`,
  path => `{{echo (helper ${path})}}`,
  path => `<div {{helper ${path}}}></div>`,
];

let good = [
  '{{debugger}}',
  '{{has-block}}',
  '{{hasBlock}}',
  '{{input}}',
  '{{outlet}}',
  '{{textarea}}',
  '{{yield}}',
  '{{welcome-page}}',
  {
    config: { allow: ['book-details'] },
    template: '{{book-details}}',
  },
  {
    config: { allow: [/^data-test-.+/] },
    template: '{{foo-bar data-test-foo}}',
  },
];

statements.forEach(statement => {
  good.push(`${statement('@book')}`);
  good.push(`${statement('@book.author')}`);
  good.push(`${statement('this.book')}`);
  good.push(`${statement('this.book.author')}`);
  good.push(`{{#books as |book|}}${statement('book')}{{/books}}`);
  good.push(`{{#books as |book|}}${statement('book.author')}{{/books}}`);
});

generateRuleTests({
  name: 'no-implicit-this',

  config: true,

  good,

  bad: [
    {
      template: '{{book}}',
      result: {
        message: message('book'),
        source: 'book',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{book-details}}',
      result: {
        message: message('book-details'),
        source: 'book-details',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{book.author}}',
      result: {
        message: message('book.author'),
        source: 'book.author',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{helper book}}',
      result: {
        message: message('book'),
        source: 'book',
        line: 1,
        column: 9,
      },
    },
    {
      template: '{{#helper book}}{{/helper}}',
      result: {
        message: message('book'),
        source: 'book',
        line: 1,
        column: 10,
      },
    },
  ],
});
