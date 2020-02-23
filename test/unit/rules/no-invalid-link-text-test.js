'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-link-text',

  config: true,

  good: [
    '<a href="https://myurl.com">Click here to read more about this amazing adventure</a>',
    '{{#link-to}} click here to read more about our company{{/link-to}}',
    '<LinkTo>Read more about ways semantic HTML can make your code more accessible.</LinkTo>',
    '<LinkTo>{{foo}} more</LinkTo>',
  ],

  bad: [
    {
      template: '<a href="https://myurl.com">click here</a>',
      result: {
        message: 'Links should have descriptive text',
        source: '<a href="https://myurl.com">click here</a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<LinkTo>click here</LinkTo>',
      result: {
        message: 'Links should have descriptive text',
        source: '<LinkTo>click here</LinkTo>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#link-to}}click here{{/link-to}}',
      result: {
        message: 'Links should have descriptive text',
        source: '{{#link-to}}click here{{/link-to}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
