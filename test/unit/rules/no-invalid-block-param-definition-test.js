'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/no-invalid-block-param-definition').message;

generateRuleTests({
  name: 'no-invalid-block-param-definition',

  config: true,

  good: ['<MyComponent as |foo|>{{foo}}</MyComponent>'],

  bad: [
    {
      template: '<MyComponent as |a|>{{foo}}</MyComponent>',

      result: {
        message: message('MyComponent', []),
        moduleId: 'layout.hbs',
        source: '<MyComponent as |foo|>{{foo}}</MyComponent>',
        line: 1,
        column: 0,
      },
    },
  ],
});
