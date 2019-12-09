'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({

  name: 'new-rule-name',

  config: true,

  good: [
    'passingTest00',
    'passing Test01'
  ],


  bad: [
  
    {
      template: 'FailingTest00',
      result: {
        moduleId: 'layout.hbs',
        message: 'Error Message to Report',
        line: 1,
        column: 0,
        source: 'FailingTest00',
      },
    },

  ]
  
});
