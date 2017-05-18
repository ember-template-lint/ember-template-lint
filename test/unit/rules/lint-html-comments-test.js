'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'html-comments',

  config: true,

  good: [
    '{{!-- comment here --}}',
    '{{!--comment here--}}',
    '{{! template-lint-disable bare-strings }}',
    '{{! template-lint-disable }}'
  ],

  bad: [
    {
      template: '<!-- comment here -->',

      result: {
        rule: 'html-comments',
        message: 'HTML comment detected',
        moduleId: 'layout.hbs',
        source: '<!-- comment here -->',
        line: 1,
        column: 0,
        fix: {
          text: '{{! comment here }}'
        }
      }
    },
    {
      template: '<!--comment here-->',

      result: {
        rule: 'html-comments',
        message: 'HTML comment detected',
        moduleId: 'layout.hbs',
        source: '<!--comment here-->',
        line: 1,
        column: 0,
        fix: {
          text: '{{!comment here}}'
        }
      }
    }
  ]
});
