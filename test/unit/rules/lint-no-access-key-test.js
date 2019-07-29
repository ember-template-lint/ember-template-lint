'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message =
  'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.';

generateRuleTests({
  name: 'no-access-key',

  config: true,

  good: ['<div></div>'],

  bad: [
    {
      template: '<button accesskey="n"></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey="n"></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button accesskey></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button accesskey={{some-key}}></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey={{some-key}}></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button accesskey="{{some-key}}"></button>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<button accesskey="{{some-key}}"></button>',
        line: 1,
        column: 0,
      },
    },
  ],
});
