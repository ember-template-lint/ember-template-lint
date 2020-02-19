'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-link-title',

  config: true,

  good: [
    '<a href="https://myurl.com">Click here to read more about this amazing adventure</a>',
    '{{#link-to}} click here to read more about our company{{/link-to}}',
    '<LinkTo>Read more about ways semantic HTML can make your code more accessible.</LinkTo>',
    '<LinkTo>{{foo}} more</LinkTo>',
    '<a href="https://myurl.com" title="New to Ember? Read the full tutorial for the best experience">Read the Tutorial</a>',
  ],

  bad: [
    {
      template: '<a href="https://myurl.com" title="read the tutorial">Read the Tutorial</a>',
      result: {
        message: 'Title attribute values should not be the same as the link text.',
        moduleId: 'layout.hbs',
        source: '<a href="https://myurl.com" title="read the tutorial">Read the Tutorial</a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<LinkTo title="quickstart">Quickstart</LinkTo>',
      result: {
        message: 'Title attribute values should not be the same as the link text.',
        moduleId: 'layout.hbs',
        source: '<LinkTo title="quickstart">Quickstart</LinkTo>',
        line: 1,
        column: 0,
      },
    },
  ],
});
