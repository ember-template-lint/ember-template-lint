'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-invalid-block-param-definition').message;

generateRuleTests({
  name: 'no-invalid-block-param-definition',

  config: true,

  good: ['<MyComponent as |foo|>{{foo}}</MyComponent>'],

  bad: [
    {
      template: '<Foo |a></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage. "<Foo ... as |param1 param2|>" Missing " as " keyword before block symbol "|". Missing "|" block symbol.',
        source: '<Foo |a>',
      },
    },
    {
      template: '<Foo |a|></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage. "<Foo ... as |param1 param2|>" Missing " as " keyword before block symbol "|". Missing "|" block symbol.',
        source: '<Foo |a|>',
      },
    },
    {
      template: '<Foo a|></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage. "<Foo ... as |param1 param2|>" Missing " as " keyword before block symbol "|". Missing "|" block symbol.',
        source: '<Foo a|>',
      },
    },
  ],
});
