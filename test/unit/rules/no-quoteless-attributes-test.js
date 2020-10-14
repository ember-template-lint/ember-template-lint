'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-quoteless-attributes',

  config: true,

  good: [
    '<div data-foo="derp"></div>',
    '<div data-foo="derp {{stuff}}"></div>',
    '<div data-foo={{someValue}}></div>',
    '<div data-foo={{true}}></div>',
    '<div data-foo={{false}}></div>',
    '<div data-foo={{5}}></div>',
    '<SomeThing ...attributes />',
    '<div></div>',
    '<input disabled>',
  ],

  bad: [
    {
      template: '<div data-foo=asdf></div>',

      result: {
        column: 14,
        line: 1,
        message: 'Attribute data-foo should be either quoted or wrapped in mustaches',
        source: '<div data-foo=asdf></div>',
      },
    },
    {
      template: '<SomeThing @blah=asdf />',

      result: {
        column: 17,
        line: 1,
        message: 'Argument @blah should be either quoted or wrapped in mustaches',
        source: '<SomeThing @blah=asdf />',
      },
    },
  ],
});
