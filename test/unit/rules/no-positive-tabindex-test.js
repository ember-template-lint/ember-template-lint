'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-positive-tabindex',

  config: true,

  good: [
    '<button tabindex="0"></button>',
    '<button tabindex="-1"></button>',
    '<button tabindex={{-1}}>baz</button>',
    '<button tabindex={{"-1"}}>baz</button>',
    '<button tabindex="{{-1}}">baz</button>',
    '<button tabindex="{{"-1"}}">baz</button>',
    '<button tabindex="{{if this.show -1}}">baz</button>',
    '<button tabindex="{{if this.show "-1" "0"}}">baz</button>',
    '<button tabindex="{{if (not this.show) "-1" "0"}}">baz</button>',
    '<button tabindex={{if this.show -1}}>baz</button>',
    '<button tabindex={{if this.show "-1" "0"}}>baz</button>',
    '<button tabindex={{if (not this.show) "-1" "0"}}>baz</button>',
  ],

  bad: [
    {
      template: '<button tabindex={{someProperty}}></button>',

      result: {
        message: 'Tabindex values must be negative numeric.',
        source: 'tabindex={{someProperty}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="1"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="1"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="text"></button>',

      result: {
        message: 'Tabindex values must be negative numeric.',
        source: 'tabindex="text"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex={{true}}></button>',

      result: {
        message: 'Tabindex values must be negative numeric.',
        source: 'tabindex={{true}}',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{false}}"></button>',

      result: {
        message: 'Tabindex values must be negative numeric.',
        source: 'tabindex="{{false}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{5}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{5}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{if a 1 -1}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{if a 1 -1}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{if a -1 1}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{if a -1 1}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{if a 1}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{if a 1}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{if (not a) 1}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{if (not a) 1}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{unless a 1}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{unless a 1}}"',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<button tabindex="{{unless a -1 1}}"></button>',

      result: {
        message: 'Avoid positive integer values for tabindex.',
        source: 'tabindex="{{unless a -1 1}}"',
        line: 1,
        column: 0,
      },
    },
  ],
});
