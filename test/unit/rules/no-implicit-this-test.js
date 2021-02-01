'use strict';

const { ARGLESS_BUILTIN_HELPERS, message } = require('../../../lib/rules/no-implicit-this');
const generateRuleTests = require('../../helpers/rule-test-harness');

let statements = [
  (path) => `{{${path}}}`,
  (path) => `{{${path} argument=true}}`,
  (path) => `{{#${path}}}{{/${path}}}`,
  (path) => `{{helper argument=${path}}}`,
  (path) => `{{#helper argument=${path}}}{{/helper}}`,
  (path) => `{{echo (helper ${path})}}`,
  (path) => `<div {{helper ${path}}}></div>`,
];

let builtins = ARGLESS_BUILTIN_HELPERS.reduce((accumulator, helper) => {
  return [...accumulator, `{{${helper}}}`, `{{"inline: " (${helper})}}`];
}, []);

let good = [
  ...builtins,
  '{{welcome-page}}',
  '<WelcomePage />',
  '<MyComponent @prop={{can "edit" @model}} />',
  {
    config: { allow: ['book-details'] },
    template: '{{book-details}}',
  },
  {
    config: { allow: [/^data-test-.+/] },
    template: '{{foo-bar data-test-foo}}',
  },
];

for (const statement of statements) {
  good.push(
    `${statement('@book')}`,
    `${statement('@book.author')}`,
    `${statement('this.book')}`,
    `${statement('this.book.author')}`,
    `{{#books as |book|}}${statement('book')}{{/books}}`,
    `{{#books as |book|}}${statement('book.author')}{{/books}}`
  );
}

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
    {
      template: '<MyComponent @prop={{can.do}} />',
      result: {
        message: message('can.do'),
        source: 'can.do',
        line: 1,
        column: 21,
      },
    },
    {
      template: '<MyComponent @prop={{can.do}} />',
      config: { allow: ['can'] },
      result: {
        message: message('can.do'),
        source: 'can.do',
        line: 1,
        column: 21,
      },
    },
    {
      template: '{{session.user.name}}',
      result: {
        message: message('session.user.name'),
        source: 'session.user.name',
        line: 1,
        column: 2,
      },
    },
    {
      template: '<MyComponent @prop={{session.user.name}} />',
      result: {
        message: message('session.user.name'),
        source: 'session.user.name',
        line: 1,
        column: 21,
      },
    },
  ],
});
