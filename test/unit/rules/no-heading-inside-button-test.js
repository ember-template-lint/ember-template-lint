'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/no-heading-inside-button').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-heading-inside-button',

  config: true,

  good: ['<button></button>', '<button><span></span></button>', '<button><div></div></button>'],

  bad: [
    {
      template: '<button><h1></h1></button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button><h1></h1></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h2></h2></button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button><h2></h2></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h3></h3></button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button><h3></h3></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h4></h4></button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button><h4></h4></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h5></h5></button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button><h5></h5></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button><h6></h6></button>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<button><h6></h6></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="button"><h6></h6></div>',
      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '<div role="button"><h6></h6></div>',
        line: 1,
        column: 0,
      },
    },
  ],
});
