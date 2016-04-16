'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'html-comments',

  config: true,

  good: [
    '{{!-- comment here --}}',
    '{{!--comment here--}}',
    '<!-- template-lint bare-strings=false -->',
    '<!-- template-lint enabled=false -->'
  ],

  bad: [
    {
      template: '<!-- comment here -->',
      message: 'Html comment detected `<!-- comment here -->` at (\'layout.hbs\'@ L1:C3). ' +
        'Use Handlebars comment instead `{{!-- comment here --}}`'
    },
    {
      template: '<!--comment here-->',
      message: 'Html comment detected `<!--comment here-->` at (\'layout.hbs\'@ L1:C3). ' +
        'Use Handlebars comment instead `{{!--comment here--}}`'
    }
  ]
});
