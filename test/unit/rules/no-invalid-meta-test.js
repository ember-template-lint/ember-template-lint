'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-meta',

  config: true,

  good: [
    '<meta http-equiv="refresh" content="0; url=http://www.example.com">',
    '<meta http-equiv="refresh" content="72001">',
  ],

  bad: [
    {
      template: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta redirect should not have a delay value greater than zero',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',
      },
    },
    {
      template: '<meta http-equiv="refresh" content="71999">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta refresh should have a delay greater than 72000 seconds',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="71999">',
      },
    },
  ],
});
