'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-meta-redirect-with-time-limit',

  config: true,

  good: ['<meta http-equiv="refresh" content="0; url=http://www.example.com" />'],

  bad: [
    {
      template: '<meta http-equiv="refresh" content="1; url=http://www.example.com" />',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta redirect should not have a delay value greater than zero',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="1; url=http://www.example.com" />',
      },
    },
  ],
});
