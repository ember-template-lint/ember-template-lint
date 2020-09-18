'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-valid-svg',

  config: true,

  good: [
    '<svg role="image" alt="valid alternative text"><title>Image description</title></svg>',
    '<a href="lint.html" aria-label="home page"><svg aria-hidden="true"></svg></a>',
    '<button aria-label="sort ascending to descending"><svg aria-hidden="true"></svg></button>',
  ],

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
    {
      template: '<svg alt></svg>',

      result: {
        message:
          'An `<svg>` element without role `image` should not have the `alt` attribute defined',
        source: '<svg alt></svg>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><svg></svg></button>',

      result: {
        message:
          'An `<svg>` element inside a `<a>` or `<button>` element should have the `aria-hidden` attribute set to true',
        source: '<svg></svg>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><svg aria-hidden="true"></svg></button>',

      result: {
        message:
          'Parent tag of an `<svg>` element should have an none empty `aria-label` attribute',
        source: '<button><svg aria-hidden="true"></svg></button>',
        line: 1,
        column: 0,
      },
    },
  ],
});
