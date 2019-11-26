'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const {
  ERROR_MESSAGE,
  ERROR_MESSAGE_2,
  ERROR_MESSAGE_3,
} = require('../../../lib/rules/lint-no-arguments-for-html-elements');

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
    '<@foo @name="2" />',
    '<foo.some.name @name="1"/>',
    '<div name="@value"></div>',
    '<div name=\'@value\'></div>',
    '<div name=`@value`></div>',
  ],

  bad: [
    {
      template: '<div as |a|></div>',
      result: {
        message: ERROR_MESSAGE_3.replace('%', 'a'),
        moduleId: 'layout.hbs',
        source: '<div as |a|></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div name=@value></div>',
      result: {
        message: ERROR_MESSAGE_2.replace('%', '@value').replace('%', 'name={{@value}}'),
        moduleId: 'layout.hbs',
        source: '@value',
        line: 1,
        column: 10,
      },
    },
    {
      template: '<div name=this.name></div>',
      result: {
        message: ERROR_MESSAGE_2.replace('%', 'this.name').replace('%', 'name={{this.name}}'),
        moduleId: 'layout.hbs',
        source: 'this.name',
        line: 1,
        column: 10,
      },
    },
    {
      template: '<div @value="1"></div>',
      result: {
        message: ERROR_MESSAGE.replace('%', '@value').replace('%', 'div'),
        moduleId: 'layout.hbs',
        source: '@value="1"',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div @value></div>',
      result: {
        message: ERROR_MESSAGE.replace('%', '@value').replace('%', 'div'),
        moduleId: 'layout.hbs',
        source: '@value',
        line: 1,
        column: 5,
      },
    },
  ],
});
