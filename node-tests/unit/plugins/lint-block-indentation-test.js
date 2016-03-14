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
      '</div>',
    '{{#link-to "foo.bar"}}Blah{{/link-to}}',
    '<input \n' +
      '  data-foo="blah"\n' +
      '  data-bar="derp"\n' +
      '  data-qux="blammo">',

    // child indentation examples
    '<div>\n' +
      '  <p>Hi!</p>\n' +
      '</div>',
    '<div><p>Hi!</p></div>',
    '{{#if foo}}\n' +
      '  <p>Hi!</p>\n' +
      '{{/if}}',
    '{{#if foo}}<p>Hi!</p>{{/if}}',
    {
      config: 4,

      template: '' +
        '<div>\n' +
        '    <p>Hi!</p>\n' +
        '</div>'
    },
    {
      config: 'tab',

      template: '' +
        '<div>\n' +
        '\t<p>Hi!</p>\n' +
        '</div>'
    }
  ],

  bad: [
    {
      // start and end must be the same indentation
      template: '\n  {{#each cats as |dog|}}\n        {{/each}}',

      message: "Incorrect indentation for `each` beginning at ('layout.hbs'@ L2:C2). Expected `{{/each}}` ending at ('layout.hbs'@ L3:C17)to be at an indentation of 2 but was found at 8."
    },
    {
      template: '<div>\n  <p>Stuff goes here</p></div>',

      message: "Incorrect indentation for `div` beginning at ('layout.hbs'@ L1:C0). Expected `</div>` ending at ('layout.hbs'@ L2:C30)to be at an indentation of 0 but was found at 24."
    },
    {
      template: '<div>\n<p>Stuff goes here</p>\n</div>',

      message: "Incorrect indentation for `<p>` beginning at ('layout.hbs'@ L2:C0). Expected `<p>` to be at an indentation of 2 but was found at 0."
    },
    {
      template: '{{#if}}\n<p>Stuff goes here</p>\n{{/if}}',

      message: "Incorrect indentation for `<p>` beginning at ('layout.hbs'@ L2:C0). Expected `<p>` to be at an indentation of 2 but was found at 0."
    },
    {
      template: '{{#if isMorning}}\n' +
        '{{else}}\n' +
        '  {{#if something}}\n' +
        '    Good night\n' +
        '    {{/if}}\n' +
        '{{/if}}',

      message: "Incorrect indentation for `if` beginning at ('layout.hbs'@ L3:C2). Expected `{{/if}}` ending at ('layout.hbs'@ L5:C11)to be at an indentation of 2 but was found at 4."
    },
    {
      config: 4,

      template: '' +
        '<div>\n' +
        '  <p>Hi!</p>\n' +
        '</div>',

      message: "Incorrect indentation for `<p>` beginning at ('layout.hbs'@ L2:C2). Expected `<p>` to be at an indentation of 4 but was found at 2."
    },
    {
      template: '<div>\n' +
        '  <span></span>{{test}}\n' +
        '</div>',

      message: "Incorrect indentation for `{{test}}` beginning at ('layout.hbs'@ L2:C15). Expected `{{test}}` to be at an indentation of 2 but was found at 15."
    },
    {
      template: '<div>\n' +
        '  <span></span>{{#test-foo}}{{/test-foo}}\n' +
        '</div>',

      message: "Incorrect indentation for `{{#test-foo}}` beginning at ('layout.hbs'@ L2:C15). Expected `{{#test-foo}}` to be at an indentation of 2 but was found at 15."
    }
  ]
});
