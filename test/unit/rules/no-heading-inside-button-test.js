'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/no-heading-inside-button').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-heading-inside-button',

  config: true,

  good: [
    '<button>Show More</button>',
    '<button><span>thumbs-up emoji</span>Show More</button>',
    '<button><div>Show More</div></button>',
    '<div>Showing that it is not a button</div>',
    '<div><h1>Page Title in a div is fine</h1></div>',
    '<h1>Page Title</h1>',
  ],

  bad: [
    {
      template: '<button><h1>Page Title</h1></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1>Page Title</h1>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><h2>Heading Title</h2></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h2>Heading Title</h2>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><h3>Heading Title</h3></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h3>Heading Title</h3>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><h4>Heading Title</h4></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h4>Heading Title</h4>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><h5>Heading Title</h5></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h5>Heading Title</h5>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><div><h1>Heading Title</h1></div></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1>Heading Title</h1>',
        line: 1,
        column: 13,
      },
    },
    {
      template: '<button><h6>Heading Title</h6></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h6>Heading Title</h6>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<div role="button"><h6>Heading in a div with a role of button</h6></div>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h6>Heading in a div with a role of button</h6>',
        line: 1,
        column: 19,
      },
    },
  ],
});
