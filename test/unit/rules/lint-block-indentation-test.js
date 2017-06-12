'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'block-indentation',

  config: 2,

  good: [
    [
      '<div>',
      '  \\{{example}}',
      '</div>'
    ].join('\n'),
    [
      '<div>',
      '  {{! What a comment}}',
      '  {{foo-bar}}',
      '</div>'
    ].join('\n'),
    [
      '{{{{if isMorning}}}}',
      '  Good Morning',
      '{{{{/if}}}}'
    ].join('\n'),
    [
      '{{#if isDoc}}',
      '  Download',
      '{{else if isIframe}}',
      '  <iframe src="some_url"></iframe>',
      '{{/if}}'
    ].join('\n'),
    '\n  {{#each cats as |dog|}}\n  {{/each}}',
    '<div><p>Stuff</p></div>',
    '<div>\n  <p>Stuff Here</p>\n</div>',
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
    '<div>\n' +
      '  <span>Foo</span>{{#some-thing}}<p>lorum ipsum</p>{{/some-thing}}\n' +
      '</div>',
    '{{#if foo}}\n' +
      '  {{foo}}-{{bar}}\n' +
      '{{/if}}',
    '{{#if foo}}\n' +
      '  Foo-{{bar}}\n' +
      '{{/if}}',
    '{{#if foo}}\n' +
      '  Foo:\n' +
      '  {{bar}}\n' +
      '{{/if}}',
    '{{#if foo}}\n' +
      '  {{foo}}:\n' +
      '  {{bar}}\n' +
      '{{/if}}',
    [
      '{{#if foo}}',
      '  <div></div>',
      '{{~/if}}'
    ].join('\n'),
    [
      '{{~#if foo}}',
      '  <div></div>',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo~}}',
      '  <div></div>',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '  <div></div>',
      '{{/if~}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '  <div></div>',
      '{{~else}}',
      '  <div></div>',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '  <div></div>',
      '{{else~}}',
      '  <div></div>',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '  <div></div>',
      '{{~else~}}',
      '  <div></div>',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '  <div></div>',
      '{{else}}',
      '  <div></div>',
      '{{~/if~}}'
    ].join('\n'),
    [
      '{{#if foo~}}',
      '  -',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '{{else if bar}}',
      '{{else}}',
      '  {{#if baz}}',
      '  {{/if~}}',
      '{{/if}}'
    ].join('\n'),
    [
      '{{#if foo}}',
      '  <div>do foo</div>',
      '{{else if bar~}}',
      '  <div>do bar</div>',
      '{{/if}}'
    ].join('\n'),
    [
      '<div class="multi"',
      '     id="lines"></div>'
    ].join('\n'),
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
    },
    '{{! template-lint-disable bare-strings }}',
    '{{! template-lint-disable }}',
    {
      template: [
        '<div>',
        '  {{foo-bar baz="asdf"}}',
        '  <!-- foo bar baz -->',
        '</div>'
      ].join('\n')
    },
    [
      '\uFEFF{{#if foo}}',
      '  <div></div>',
      '{{/if}}'
    ].join('\n')
  ],

  bad: [
    {
      // start and end must be the same indentation
      template: '\n  {{#each cats as |dog|}}\n        {{/each}}',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `each` beginning at L2:C2. Expected `{{/each}}` ending at L3:C17 to be at an indentation of 2 but was found at 8.',
        moduleId: 'layout.hbs',
        source: '{{#each cats as |dog|}}\n        {{/each}}',
        line: 3,
        column: 17
      }
    },
    {
      template: '<div>\n  </div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `div` beginning at L1:C0. Expected `</div>` ending at L2:C8 to be at an indentation of 0 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '<div>\n  </div>',
        line: 2,
        column: 8
      }
    },
    {
      template: '<div>\n  <p>Stuff goes here</p></div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `div` beginning at L1:C0. Expected `</div>` ending at L2:C30 to be at an indentation of 0 but was found at 24.',
        moduleId: 'layout.hbs',
        source: '<div>\n  <p>Stuff goes here</p></div>',
        line: 2,
        column: 30
      }
    },
    {
      template: '<div>\n<p>Stuff goes here</p>\n</div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `<p>` beginning at L2:C0. Expected `<p>` to be at an indentation of 2 but was found at 0.',
        moduleId: 'layout.hbs',
        source: '<div>\n<p>Stuff goes here</p>\n</div>',
        line: 2,
        column: 0
      }
    },
    {
      template: '{{#if}}\n<p>Stuff goes here</p>\n{{/if}}',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `<p>` beginning at L2:C0. Expected `<p>` to be at an indentation of 2 but was found at 0.',
        moduleId: 'layout.hbs',
        source: '{{#if}}\n<p>Stuff goes here</p>\n{{/if}}',
        line: 2,
        column: 0
      }
    },
    {
      template: '{{#if isMorning}}\n' +
        '{{else}}\n' +
        '  {{#if something}}\n' +
        '    Good night\n' +
        '    {{/if}}\n' +
        '{{/if}}',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `if` beginning at L3:C2. Expected `{{/if}}` ending at L5:C11 to be at an indentation of 2 but was found at 4.',
        moduleId: 'layout.hbs',
        source: '{{#if something}}\n    Good night\n    {{/if}}',
        line: 5,
        column: 11
      }
    },
    {
      config: 4,

      template: '' +
        '<div>\n' +
        '  <p>Hi!</p>\n' +
        '</div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `<p>` beginning at L2:C2. Expected `<p>` to be at an indentation of 4 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '<div>\n  <p>Hi!</p>\n</div>',
        line: 2,
        column: 2
      }
    },
    {
      template: '<div>\n' +
        '  {{foo}}\n' +
        '{{bar}}\n' +
        '</div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `{{bar}}` beginning at L3:C0. Expected `{{bar}}` to be at an indentation of 2 but was found at 0.',
        moduleId: 'layout.hbs',
        source: '<div>\n  {{foo}}\n{{bar}}\n</div>',
        line: 3,
        column: 0
      }
    },
    {
      template: '<div>\n' +
        '  Foo:\n' +
        '{{bar}}\n' +
        '</div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `{{bar}}` beginning at L3:C0. Expected `{{bar}}` to be at an indentation of 2 but was found at 0.',
        moduleId: 'layout.hbs',
        source: '<div>\n  Foo:\n{{bar}}\n</div>',
        line: 3,
        column: 0
      }
    },
    {
      // Start and end of multi-line block must be aligned, even when start
      // has other content preceding it on its line
      template: '<div>\n' +
        '  <span>Foo</span>{{#some-thing}}\n' +
        '  {{/some-thing}}\n' +
        '</div>',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `some-thing` beginning at L2:C18. Expected `{{/some-thing}}` ending at L3:C17 to be at an indentation of 18 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '{{#some-thing}}\n  {{/some-thing}}',
        line: 3,
        column: 17
      }
    },
    {
      // Start and end of multi-line element must be aligned, even when start
      // has other content preceding it on its line
      template: '{{#if foo}}\n' +
        '  {{foo}} <p>\n' +
        '            Bar\n' +
        '  </p>\n' +
        '{{/if}}',

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `p` beginning at L2:C10. Expected `</p>` ending at L4:C6 to be at an indentation of 10 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '<p>\n            Bar\n  </p>',
        line: 4,
        column: 6
      }
    },

    {
      template: [
        '<div>',
        '<!-- foo bar baz -->',
        '</div>'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `<!-- foo bar baz -->` beginning at L2:C0. Expected `<!-- foo bar baz -->` to be at an indentation of 2 but was found at 0.',
        moduleId: 'layout.hbs',
        source: '<div>\n<!-- foo bar baz -->\n</div>',
        line: 2,
        column: 0
      }
    },
    {
      template: [
        '{{#if foo}}',
        '  {{else}}',
        '{{/if}}'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for inverse block of `{{#if}}` beginning at L1:C0. Expected `{{else}}` starting at L2:C2 to be at an indentation of 0 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '{{else}}\n',
        line: 2,
        column: 2
      }
    },

    {
      template: [
        '{{#if foo}}',
        '{{else if bar}}',
        '{{else}}',
        '  {{#if baz}}',
        '  {{/if~}}',
        '  {{/if}}'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `if` beginning at L1:C0. Expected `{{/if}}` ending at L6:C9 to be at an indentation of 0 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '{{#if foo}}\n{{else if bar}}\n{{else}}\n  {{#if baz}}\n  {{/if~}}\n  {{/if}}',
        line: 6,
        column: 9
      }
    },

    {
      template: [
        '{{#each foo as |bar|}}',
        '  {{else}}',
        '{{/each}}'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for inverse block of `{{#each}}` beginning at L1:C0. Expected `{{else}}` starting at L2:C2 to be at an indentation of 0 but was found at 2.',
        moduleId: 'layout.hbs',
        source: '{{else}}\n',
        line: 2,
        column: 2
      }
    },

    {
      template: [
        '<div>',
        '  {{#if foo}}',
        '  {{/if}}',
        '    {{! comment with incorrect indentation }}',
        '</div>'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `{{! comment with incorrect indentation }}` beginning at L4:C4. Expected `{{! comment with incorrect indentation }}` to be at an indentation of 2 but was found at 4.',
        moduleId: 'layout.hbs',
        source: '<div>\n  {{#if foo}}\n  {{/if}}\n    {{! comment with incorrect indentation }}\n</div>',
        line: 4,
        column: 4
      }
    },

    {
      template: [
        '{{#if isMorning}}' +
        '  Good morning\n' +
        '{{else if isAfternoon}}\n' +
        '  Good afternoon\n' +
        '{{else}}\n' +
        '  Good night\n' +
        '{{/if}}'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `  Good morning\n` beginning at L1:C17. Expected `  Good morning\n` to be at an indentation of 2 but was found at 19.',
        moduleId: 'layout.hbs',
        source: '{{#if isMorning}}  Good morning\n{{else if isAfternoon}}\n  Good afternoon\n{{else}}\n  Good night\n{{/if}}',
        line: 1,
        column: 17
      }
    },

    {
      template: [
        '{{#if isMorning}}\n' +
        '  Good morning\n' +
        '{{else if isAfternoon~}}\n' +
        '    Good afternoon\n' +
        '{{/if}}'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `Good afternoon\n` beginning at L4:C4. Expected `Good afternoon\n` to be at an indentation of 2 but was found at 4.',
        moduleId: 'layout.hbs',
        source: '{{else if isAfternoon~}}\n    Good afternoon\n',
        line: 4,
        column: 4
      }
    },
    {
      template: [
        '<div>',
        '{{! What a comment }}',
        '  {{foo-bar}}',
        '</div>'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `{{! What a comment }}` beginning at L2:C0. Expected `{{! What a comment }}` to be at an indentation of 2 but was found at 0.',
        moduleId: 'layout.hbs',
        source: '<div>\n{{! What a comment }}\n  {{foo-bar}}\n</div>',
        line: 2,
        column: 0
      }
    },
    {
      template: [
        '<div> {{! bad comment }}',
        '  {{foo-bar}}',
        '</div>'
      ].join('\n'),

      result: {
        rule: 'block-indentation',
        message: 'Incorrect indentation for `{{! bad comment }}` beginning at L1:C6. Expected `{{! bad comment }}` to be at an indentation of 2 but was found at 6.',
        moduleId: 'layout.hbs',
        source: '<div> {{! bad comment }}\n  {{foo-bar}}\n</div>',
        line: 1,
        column: 6
      }
    }
  ]
});
