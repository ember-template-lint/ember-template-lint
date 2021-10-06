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
    '<a href="https://myurl.com" aria-labelledby="some-id"></a>',
    '<a href="https://myurl.com" aria-label="click here to read about our company"></a>',
    '<a href="https://myurl.com" aria-hidden="true"></a>',
    '<a href="https://myurl.com" hidden></a>',
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
    {
      template: '<a href="https://myurl.com"></a>',
      result: {
        message: 'Links should have descriptive text',
        source: '<a href="https://myurl.com"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a href="https://myurl.com"> </a>',
      result: {
        message: 'Links should have descriptive text',
        source: '<a href="https://myurl.com"> </a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a href="https://myurl.com"> &nbsp; \n</a>',
      result: {
        message: 'Links should have descriptive text',
        source: '<a href="https://myurl.com"> &nbsp; \n</a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a aria-labelledby="" href="https://myurl.com">Click here</a>',
      result: {
        message: 'Links should have descriptive text',
        source: '<a aria-labelledby="" href="https://myurl.com">Click here</a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a aria-label="Click here" href="https://myurl.com">Click here</a>',
      result: {
        message: 'Links should have descriptive text',
        source: '<a aria-label="Click here" href="https://myurl.com">Click here</a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<LinkTo></LinkTo>',
      result: {
        message: 'Links should have descriptive text',
        source: '<LinkTo></LinkTo>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<LinkTo> &nbsp; \n</LinkTo>',
      result: {
        message: 'Links should have descriptive text',
        source: '<LinkTo> &nbsp; \n</LinkTo>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#link-to}}{{/link-to}}',
      result: {
        message: 'Links should have descriptive text',
        source: '{{#link-to}}{{/link-to}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '{{#link-to}} &nbsp; \n{{/link-to}}',
      result: {
        message: 'Links should have descriptive text',
        source: '{{#link-to}} &nbsp; \n{{/link-to}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
