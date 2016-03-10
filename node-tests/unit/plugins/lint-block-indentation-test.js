'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'block-indentation',

  good: [
    '\n  {{#each cats as |dog|}}\n  {{/each}}',
    '<div><p>Stuff</p></div>',
    '<div>\n  <p>Stuff Here</p>\n</div>',
    '{{#if isMorning}}' +
      '  Good morning\n' +
      '{{else if isAfternoon}}' +
      '  Good afternoon\n' +
      '{{else}}\n' +
      '  Good night\n' +
      '{{/if}}',
    '{{#if isMorning}}\n' +
      '  Good morning\n' +
      '{{else foo-bar isAfternoon}}\n' +
      '  Good afternoon\n' +
      '{{else}}\n' +
      '  Good night\n' +
      '{{/if}}',
    '<div>\n' +
      '  {{#if isMorning}}\n' +
      '    Good morning\n' +
      '  {{else if isAfternoon}}\n' +
      '    Good afternoon\n' +
      '  {{else}}\n' +
      '    Good night\n' +
      '  {{/if}}\n' +
      '</div>'
  ],

  bad: [
    {
      // start and end must be the same indentation
      template: '\n  {{#each cats as |dog|}}\n        {{/each}}',

      message: "Incorrect indentation for `each` beginning at ('layout.hbs'@ L2:C2). Expected `{{/each}}` ending at ('layout.hbs'@ L3:C17)to be at an indentation of 2 but was found at 8."
    },
    {
      // block statements must be multiline
      template: '{{#each cats as |dog|}}{{/each}}',

      message: "Incorrect indentation for `each` beginning at ('layout.hbs'@ L1:C0). Expected `{{/each}}` ending at ('layout.hbs'@ L1:C32)to be at an indentation of 0 but was found at 23."
    },
    {
      template: '<div>\n  <p>Stuff goes here</p></div>',

      message: "Incorrect indentation for `div` beginning at ('layout.hbs'@ L1:C0). Expected `</div>` ending at ('layout.hbs'@ L2:C30)to be at an indentation of 0 but was found at 24."
    },
    {
      template: '{{#if isMorning}}\n' +
        '{{else}}\n' +
        '  {{#if something}}\n' +
        '    Good night\n' +
        '    {{/if}}\n' +
        '{{/if}}',

      message: "Incorrect indentation for `if` beginning at ('layout.hbs'@ L3:C2). Expected `{{/if}}` ending at ('layout.hbs'@ L5:C11)to be at an indentation of 2 but was found at 4."
    }
  ]
});
