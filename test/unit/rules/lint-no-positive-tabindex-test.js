'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-positive-tabindex',

  config: true,

  good: [
    '<button tabindex="0"></button>',
    '<button tabindex="-1"></button>',
    '<button tabindex={{someProp}}></button>',
    '<button tabindex="{{someProp}}"></button>',
  ],

  bad: [
    {
      template: '<button tabindex="1"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        moduleId: 'layout.hbs',
        source: '<button tabindex="1"></button>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="text"></button>',

      result: {
        message: 'Tabindex values must be negative numeric.',
        moduleId: 'layout.hbs',
        source: '<button tabindex="text"></button>',
        line: 1,
        column: 0,
      },
    },
  ],
});
