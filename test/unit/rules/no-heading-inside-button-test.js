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
  ],

  bad: [
    {
      template: '<button><h1>Page Title</h1></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<button><h1>Page Title</h1></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h2>Heading Title</h2></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<button><h2>Heading Title</h2></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h3>Heading Title</h3></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<button><h3>Heading Title</h3></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h4>Heading Title</h4></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<button><h4>Heading Title</h4></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h5>Heading Title</h5></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<button><h5>Heading Title</h5></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h6>Heading Title</h6></button>',
      result: {
        message: ERROR_MESSAGE,
        source: '<button><h6>Heading Title</h6></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="button"><h6>Heading in a div with a role of button</h6></div>',
      result: {
        message: ERROR_MESSAGE,
        source: '<div role="button"><h6>Heading in a div with a role of button</h6></div>',
        line: 1,
        column: 0,
      },
    },
  ],
});
