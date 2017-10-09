'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'style-concatenation',

  config: true,

  good: [
    '<img style={{background-image url}}>',
    '<img style="background-image: url(/foo.png)"}}>'
  ],

  bad: [
    {
      template: '<img style="background-image: {{url}}">',

      result: {
        message: 'You may not use string concatenation to build up styles',
        moduleId: 'layout.hbs',
        source: 'style="background-image: {{url}}"',
        line: 1,
        column: 5
      }
    },
    {
      template: '<img style="{{background-image url}}">',

      result: {
        message: 'You may not use string concatenation to build up styles',
        moduleId: 'layout.hbs',
        source: 'style="{{background-image url}}"',
        line: 1,
        column: 5
      }
    }
  ]
});
