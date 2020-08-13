'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { makeError } = require('../../../lib/rules/no-arguments-for-html-elements');

generateRuleTests({
  name: 'no-arguments-for-html-elements',

  config: true,

  good: [
    '<Input @name=1 />',
    '{{#let (component \'foo\') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}',
    '<@externalComponent />',
    `<MyComponent>
    <:slot @name="Header"></:slot>
  </MyComponent>`,
    '<@foo.bar @name="2" />',
    '<this.name @boo="bar"></this.name>',
    '<@foo @name="2" />',
    '<foo.some.name @name="1" />',
  ],

  bad: [
    {
      template: '<div @value="1"></div>',
      result: {
        message: makeError('@value', 'div'),
        source: '@value="1"',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div @value></div>',
      result: {
        message: makeError('@value', 'div'),
        source: '@value',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<img @src="12">',
      result: {
        message: makeError('@src', 'img'),
        source: '@src="12"',
        line: 1,
        column: 5,
      },
    },
  ],
});
