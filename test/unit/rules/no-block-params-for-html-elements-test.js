'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { generateErrorMessage } = require('../../../lib/rules/no-block-params-for-html-elements');

generateRuleTests({
  name: 'no-block-params-for-html-elements',

  config: true,

  good: [
    '<div></div>',
    '<Checkbox as |blockName|></Checkbox>',
    '<@nav.Link as |blockName|></@nav.Link>',
    '<this.foo as |blah|></this.foo>',
    '{{#let (component \'foo\') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}',
    '<Something><:Item as |foo|></:Item></Something>',
  ],

  bad: [
    {
      template: '<div as |blockName|></div>',
      result: {
        message: generateErrorMessage('div'),
        line: 1,
        column: 0,
        source: '<div as |blockName|></div>',
      },
    },
    {
      template: '<div as |a b c|></div>',
      result: {
        message: generateErrorMessage('div'),
        line: 1,
        column: 0,
        source: '<div as |a b c|></div>',
      },
    },
  ],
});
