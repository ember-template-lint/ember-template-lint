'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-html-comments',

  config: true,

  good: [
    '{{!-- comment here --}}',
    '{{!--comment here--}}',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
    '{{! template-lint-disable html-comments }}<!-- lol -->',
  ],

  bad: [
    {
      template: '<!-- comment here -->',

      result: {
        message: 'HTML comment detected',
        moduleId: 'layout.hbs',
        source: '<!-- comment here -->',
        line: 1,
        column: 0,
        fix: {
          text: '{{! comment here }}',
        },
      },
    },
    {
      template: '<!--comment here-->',

      result: {
        message: 'HTML comment detected',
        moduleId: 'layout.hbs',
        source: '<!--comment here-->',
        line: 1,
        column: 0,
        fix: {
          text: '{{!comment here}}',
        },
      },
    },
  ],
});
