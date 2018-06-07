'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-interactive',

  config: true,

  good: [
    '<button {{action "foo"}}></button>',
    '<div role="button" {{action "foo"}}></div>',
    '<li><button {{action "foo"}}></button></li>',
    '<form {{action "foo" on="submit"}}></form>',
    '<form onsubmit={{action "foo"}}></form>',
    '<form {{action "foo" on="reset"}}></form>',
    '<form onreset={{action "foo"}}></form>',
    '<InputSearch @onInput={{action "foo"}} />',
    '<InputSearch @onInput={{action "foo"}}></InputSearch>',
    '<foo.bar @onInput={{action "foo"}}></foo.bar>',
    {
      config: { additionalInteractiveTags: ['div'] },
      template: '<div {{action "foo"}}></div>'
    },
    {
      config: { additionalInteractiveTags: ['div'] },
      template: '<div onclick={{action "foo"}}></div>'
    }
  ],

  bad: [
    {
      template: '<div {{action "foo"}}></div>',

      result: {
        message: 'Interaction added to non-interactive element',
        line: 1,
        column: 5,
        source: '<div {{action "foo"}}></div>'
      }
    },

    {
      template: '<div onclick={{action "foo"}}></div>',

      result: {
        message: 'Interaction added to non-interactive element',
        line: 1,
        column: 5,
        source: '<div onclick={{action "foo"}}></div>'
      }
    },

    {
      template: '<div onsubmit={{action "foo"}}></div>',

      result: {
        message: 'Interaction added to non-interactive element',
        line: 1,
        column: 5,
        source: '<div onsubmit={{action "foo"}}></div>'
      }
    },

    {
      template: '<form {{action "foo" on="click"}}></form>',

      result: {
        message: 'Interaction added to non-interactive element',
        line: 1,
        column: 6,
        source: '<form {{action "foo" on="click"}}></form>'
      }
    },

    {
      template: '<div {{action "foo" on="submit"}}></div>',

      result: {
        message: 'Interaction added to non-interactive element',
        line: 1,
        column: 5,
        source: '<div {{action "foo" on="submit"}}></div>'
      }
    }
  ]
});
