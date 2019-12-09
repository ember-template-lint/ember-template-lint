'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-link-text',

  config: true,

  good: ['<a href="https://myurl.com">Click here to read more about this amazing adventure</a>'],

  bad: [
    {
      template: '<a href="https://myurl.com">click here</a>',
      result: {
        message: 'Links should have descriptive text',
        moduleId: 'layout.hbs',
        source: '<a href="https://myurl.com">click here</a>',
        line: 1,
        column: 0,
      },
    },
  ],
});
