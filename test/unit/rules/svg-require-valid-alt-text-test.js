'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'svg-require-valid-alt-text',

  config: true,

  // TODO update with a good example that should pass
  good: [
    '<svg role="image" alt="valid alternative text"><title>Image description</title><g></g></svg>',
  ],

  // TODO update with tests that should fail
  bad: [
    {
      template: '<svg role="image"></svg>',

      result: {
        message: 'An `<svg>` element with role `image` should have a none empty alternative text',
        source: '<svg role="image"></svg>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<svg role="image" alt=""></svg>',

      result: {
        message: 'An `<svg>` element with role `image` should have a none empty alternative text',
        source: '<svg role="image" alt=""></svg>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<svg role="image" alt="valid alternative text"><g></g></svg>',

      result: {
        message:
          'An `<svg>` element with role `image` should contains contain a none empty `<title>` element',
        source: '<svg role="image" alt="valid alternative text"><g></g></svg>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<svg role="image" alt="valid alternative text"><title>  </title></svg>',

      result: {
        message:
          'An `<svg>` element with role `image` should contains contain a none empty `<title>` element',
        source: '<svg role="image" alt="valid alternative text"><title>  </title></svg>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<svg role="image"><title>Image description</title><g></g></svg>',

      result: {
        message: 'An `<svg>` element with role `image` should have a none empty alternative text',
        source: '<svg role="image"><title>Image description</title><g></g></svg>',
        line: 1,
        column: 0,
      },
    },
  ],
});
