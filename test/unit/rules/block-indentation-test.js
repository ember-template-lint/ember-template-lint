'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'block-indentation',

  config: 'error',

  good: [
    {
      template: '<div>\n' + '    <p>Hi!</p>\n' + '</div>',
      meta: {
        editorConfig: { indent_size: 4 },
      },
    },
    ['  this is fine'].join('\n'),
    ['<h1>Header</h1>', '<div>', '  \\{{example}}', '</div>'].join('\n'),
    ['<div>', '  \\{{example}}', '</div>'].join('\n'),
    ['<div>', '  {{! What a comment}}', '  {{foo-bar}}', '</div>'].join('\n'),
    ['{{{{if isMorning}}}}', '  Good Morning', '{{{{/if}}}}'].join('\n'),
    [
      '{{#if isDoc}}',
      '  Download',
      '{{else if isIframe}}',
      '  <iframe src="some_url"></iframe>',
      '{{/if}}',
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
    '<input \n' + '  data-foo="blah"\n' + '  data-bar="derp"\n' + '  data-qux="blammo">',

    // child indentation examples
    '<div>\n' + '  <p>Hi!</p>\n' + '</div>',
    '<div><p>Hi!</p></div>',
    '{{#if foo}}\n' + '  <p>Hi!</p>\n' + '{{/if}}',
    '{{#if foo}}<p>Hi!</p>{{/if}}',
    '{{#if foo}}<p>Hi!</p>{{else}}<p>Bye!</p>{{/if}}',
    '{{#if foo}}<p>Hi!</p>{{else if bar}}<p>Hello!</p>{{else}}<p>Bye!</p>{{/if}}',
    '<div>\n' + '  <span>Foo</span>{{#some-thing}}<p>lorum ipsum</p>{{/some-thing}}\n' + '</div>',
    '{{#if foo}}\n' + '  {{foo}}-{{bar}}\n' + '{{/if}}',
    '{{#if foo}}\n' + '  Foo-{{bar}}\n' + '{{/if}}',
    '{{#if foo}}\n' + '  Foo:\n' + '  {{bar}}\n' + '{{/if}}',
    '{{#if foo}}\n' + '  {{foo}}:\n' + '  {{bar}}\n' + '{{/if}}',
    ['{{#if foo}}', '  <div></div>', '{{~/if}}'].join('\n'),
    ['{{~#if foo}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo~}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{/if~}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{~else}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{else~}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{~else~}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{else}}', '  <div></div>', '{{~/if~}}'].join('\n'),
    ['{{#if foo~}}', '  -', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '{{else if bar}}', '{{else}}', '  {{#if baz}}', '  {{/if~}}', '{{/if}}'].join(
      '\n'
    ),
    [
      '{{#if foo}}',
      '  <div>do foo</div>',
      '{{else if bar~}}',
      '  <div>do bar</div>',
      '{{/if}}',
    ].join('\n'),
    ['<div class="multi"', '     id="lines"></div>'].join('\n'),
    ['{{#if foo}}', '  &nbsp;Hello', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  &nbsp;<div></div>', '{{/if}}'].join('\n'),
    {
      config: 4,

      template: '' + '<div>\n' + '    <p>LOLOL!</p>\n' + '</div>',
    },
    {
      config: 'tab',
      template: '' + '<div>\n' + '\t<p>Hi!</p>\n' + '</div>',
    },
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
    {
      template: ['<div>', '  {{foo-bar baz="asdf"}}', '  <!-- foo bar baz -->', '</div>'].join(
        '\n'
      ),
    },
    ['\uFEFF{{#if foo}}', '  <div></div>', '{{/if}}'].join('\n'),
    ["{{'this works'}}"].join('\n'),
    [
      '{{#foo-bar as |baz|}}',
      '  {{#baz.content}}',
      '    {{#component "foo-bar"}}',
      '      Content',
      '    {{/component}}',
      '  {{/baz.content}}',
      '{{/foo-bar}}',
    ].join('\n'),
    ['{{#if foo}}', '  &nbsp;bar', '{{/if}}'].join('\n'),
    '<pre>\nsome text</pre>',
    '<script>\nsome text</script>',
    '<template>\nsome text</template>',
    '<textarea>\nsome text</textarea>',
    '<textarea> \n<div>\nsome text   \n \n </div></textarea>',
    '<style>\nsome text</style>',
    '<pre>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </pre>',
    '<script>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </script>',
    '<template>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </template>',
    '<style>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </style>',
    '<textarea>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </textarea>',
    {
      config: {
        ignoreComments: true,
      },
      template: ['<div>', '<!-- Comment -->', '{{! Comment }}', '</div>'].join('\n'),
    },
    {
      config: {
        ignoreComments: true,
      },
      template: [
        '{{#if foo}}',
        '<!-- Comment -->',
        '  {{foo}}',
        '{{else}}',
        '  {{bar}}',
        '{{! Comment }}',
        '{{/if}}',
      ].join('\n'),
    },
    {
      config: {
        ignoreComments: true,
      },
      template: '{{! Comment }}<div>foo</div>',
    },
    {
      config: {
        ignoreComments: true,
      },
      template: '<div>{{! Comment }}</div>',
    },
    {
      config: {
        ignoreComments: true,
      },
      template: ['<div>', '{{! Comment }}foo', '</div>'].join('\n'),
    },
    {
      config: {
        ignoreComments: true,
      },
      template: '<div>foo</div>{{! Comment }}',
    },
    {
      config: {
        ignoreComments: true,
      },
      template: '<!-- Comment --><div>foo</div>',
    },
    {
      config: {
        ignoreComments: true,
      },
      template: '<div><!-- Comment --></div>',
    },
    {
      config: {
        ignoreComments: true,
      },
      template: '<div>foo</div><!-- Comment -->',
    },
    {
      config: {
        ignoreComments: true,
      },
      template: [
        '{{#if foo}}',
        '<!-- Comment -->',
        '  <!-- Comment -->',
        '  {{#each bar as |baz|}}',
        '{{! Comment }}',
        '    {{#each baz as |a|}}',
        '       {{! Comment }}',
        '       {{a}}',
        '<!-- Comment -->',
        '    {{/each}}',
        '{{! Comment }}',
        '  {{/each}}',
        '<!-- Comment -->',
        '{{! Comment }}',
        '{{else}}',
        ' {{! Comment }}',
        '{{/if}}',
      ].join('\n'),
    },
    {
      config: {
        ignoreComments: false,
      },
      template: ['<div>', '  <!-- Comment -->', '  {{! Comment }}', '</div>'].join('\n'),
    },
    {
      config: {
        ignoreComments: false,
      },
      template: [
        '{{#if foo}}',
        '  <!-- Comment -->',
        '  {{foo}}',
        '{{else}}',
        '  {{bar}}',
        '  {{! Comment }}',
        '{{/if}}',
      ].join('\n'),
    },
  ],

  bad: [
    {
      // start and end must be the same indentation
      template: '\n  {{#each cats as |dog|}}\n        {{/each}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 17,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Incorrect indentation for \`each\` beginning at L2:C2. Expected \`{{/each}}\` ending at L3:C17 to be at an indentation of 2 but was found at 8.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#each cats as |dog|}}
                  {{/each}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div>\n  </div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`div\` beginning at L1:C0. Expected \`</div>\` ending at L2:C8 to be at an indentation of 0 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
            </div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div>\n  <p>Stuff goes here</p></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 30,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`div\` beginning at L1:C0. Expected \`</div>\` ending at L2:C30 to be at an indentation of 0 but was found at 24.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
            <p>Stuff goes here</p></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div>\n<p>Stuff goes here</p>\n</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`<p>\` beginning at L2:C0. Expected \`<p>\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
          <p>Stuff goes here</p>
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: '{{#if}}\n<p>Stuff goes here</p>\n{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`<p>\` beginning at L2:C0. Expected \`<p>\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#if}}
          <p>Stuff goes here</p>
          {{/if}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{#if isMorning}}\n' +
        '{{else}}\n' +
        '  {{#if something}}\n' +
        '    Good night\n' +
        '    {{/if}}\n' +
        '{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "filePath": "layout.hbs",
              "line": 5,
              "message": "Incorrect indentation for \`if\` beginning at L3:C2. Expected \`{{/if}}\` ending at L5:C11 to be at an indentation of 2 but was found at 4.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#if something}}
              Good night
              {{/if}}",
            },
          ]
        `);
      },
    },
    {
      config: 4,

      template: '' + '<div>\n' + '  <p>Hi!</p>\n' + '</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`<p>\` beginning at L2:C2. Expected \`<p>\` to be at an indentation of 4 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
            <p>Hi!</p>
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div>\n' + '  {{foo}}\n' + '{{bar}}\n' + '</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Incorrect indentation for \`{{bar}}\` beginning at L3:C0. Expected \`{{bar}}\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
            {{foo}}
          {{bar}}
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div>\n' + '  Foo:\n' + '{{bar}}\n' + '</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Incorrect indentation for \`{{bar}}\` beginning at L3:C0. Expected \`{{bar}}\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
            Foo:
          {{bar}}
          </div>",
            },
          ]
        `);
      },
    },
    {
      // Start and end of multi-line block must be aligned, even when start
      // has other content preceding it on its line
      template:
        '<div>\n' + '  <span>Foo</span>{{#some-thing}}\n' + '  {{/some-thing}}\n' + '</div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 17,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Incorrect indentation for \`some-thing\` beginning at L2:C18. Expected \`{{/some-thing}}\` ending at L3:C17 to be at an indentation of 18 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#some-thing}}
            {{/some-thing}}",
            },
          ]
        `);
      },
    },
    {
      // Start and end of multi-line element must be aligned, even when start
      // has other content preceding it on its line
      template: '{{#if foo}}\n' + '  {{foo}} <p>\n' + '            Bar\n' + '  </p>\n' + '{{/if}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Incorrect indentation for \`p\` beginning at L2:C10. Expected \`</p>\` ending at L4:C6 to be at an indentation of 10 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<p>
                      Bar
            </p>",
            },
          ]
        `);
      },
    },

    {
      template: ['<div>', '<!-- foo bar baz -->', '</div>'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`<!-- foo bar baz -->\` beginning at L2:C0. Expected \`<!-- foo bar baz -->\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
          <!-- foo bar baz -->
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: ['{{#if foo}}', '  {{else}}', '{{/if}}'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for inverse block of \`{{#if}}\` beginning at L1:C0. Expected \`{{else}}\` starting at L2:C2 to be at an indentation of 0 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#if foo}}
            {{else}}
          {{/if}}",
            },
          ]
        `);
      },
    },

    {
      template: [
        '{{#if foo}}',
        '{{else if bar}}',
        '{{else}}',
        '  {{#if baz}}',
        '  {{/if~}}',
        '  {{/if}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "filePath": "layout.hbs",
              "line": 6,
              "message": "Incorrect indentation for \`if\` beginning at L1:C0. Expected \`{{/if}}\` ending at L6:C9 to be at an indentation of 0 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#if foo}}
          {{else if bar}}
          {{else}}
            {{#if baz}}
            {{/if~}}
            {{/if}}",
            },
          ]
        `);
      },
    },

    {
      template: ['{{#each foo as |bar|}}', '  {{else}}', '{{/each}}'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 2,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for inverse block of \`{{#each}}\` beginning at L1:C0. Expected \`{{else}}\` starting at L2:C2 to be at an indentation of 0 but was found at 2.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#each foo as |bar|}}
            {{else}}
          {{/each}}",
            },
          ]
        `);
      },
    },

    {
      template: [
        '<div>',
        '  {{#if foo}}',
        '  {{/if}}',
        '    {{! comment with incorrect indentation }}',
        '</div>',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Incorrect indentation for \`{{! comment with incorrect indentation }}\` beginning at L4:C4. Expected \`{{! comment with incorrect indentation }}\` to be at an indentation of 2 but was found at 4.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
            {{#if foo}}
            {{/if}}
              {{! comment with incorrect indentation }}
          </div>",
            },
          ]
        `);
      },
    },

    {
      template: [
        '{{#if isMorning}}' +
          '  Good morning\n' +
          '{{else if isAfternoon}}\n' +
          '  Good afternoon\n' +
          '{{else}}\n' +
          '  Good night\n' +
          '{{/if}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Incorrect indentation for \`Good morning
          \` beginning at L1:C19. Expected \`Good morning
          \` to be at an indentation of 2 but was found at 19.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#if isMorning}}  Good morning
          {{else if isAfternoon}}
            Good afternoon
          {{else}}
            Good night
          {{/if}}",
            },
          ]
        `);
      },
    },

    {
      template: [
        '{{#if isMorning}}\n' +
          '  Good morning\n' +
          '{{else if isAfternoon~}}\n' +
          '    Good afternoon\n' +
          '{{/if}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "Incorrect indentation for \`Good afternoon
          \` beginning at L4:C4. Expected \`Good afternoon
          \` to be at an indentation of 2 but was found at 4.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{else if isAfternoon~}}
              Good afternoon
          ",
            },
          ]
        `);
      },
    },
    {
      template: ['<div>', '{{! What a comment }}', '  {{foo-bar}}', '</div>'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Incorrect indentation for \`{{! What a comment }}\` beginning at L2:C0. Expected \`{{! What a comment }}\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div>
          {{! What a comment }}
            {{foo-bar}}
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: ['<div> {{! bad comment }}', '  {{foo-bar}}', '</div>'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Incorrect indentation for \`{{! bad comment }}\` beginning at L1:C6. Expected \`{{! bad comment }}\` to be at an indentation of 2 but was found at 6.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "<div> {{! bad comment }}
            {{foo-bar}}
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: ['{{#if media.isMobile}}', '{{else}}', '<span>', '</span>', '{{/if}}'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Incorrect indentation for \`<span>\` beginning at L3:C0. Expected \`<span>\` to be at an indentation of 2 but was found at 0.",
              "rule": "block-indentation",
              "severity": 2,
              "source": "{{#if media.isMobile}}
          {{else}}
          <span>
          </span>
          {{/if}}",
            },
          ]
        `);
      },
    },
    {
      template: ['\uFEFF {{#if foo}}', '{{/if}}'].join('\n'),

      results: [
        {
          message:
            'Incorrect indentation for `{{#if}}` beginning at L1:C1. Expected `{{#if}}` to be at an indentation of 0, but was found at 1.',
          source: '{{#if foo}}\n{{/if}}',
          line: 1,
          column: 1,
        },
        {
          message:
            'Incorrect indentation for `if` beginning at L1:C1. Expected `{{/if}}` ending at L2:C7 to be at an indentation of 1 but was found at 0.',
          source: '{{#if foo}}\n{{/if}}',
          line: 2,
          column: 7,
        },
      ],
    },
    {
      template: ['{{#if foo}}foo{{else}}', '  bar', '{{/if}}'].join('\n'),

      results: [
        {
          message:
            'Incorrect indentation for inverse block of `{{#if}}` beginning at L1:C0. Expected `{{else}}` starting at L1:C14 to be at an indentation of 0 but was found at 14.',
          source: '{{#if foo}}foo{{else}}\n  bar\n{{/if}}',
          line: 1,
          column: 14,
        },
        {
          message:
            'Incorrect indentation for `foo` beginning at L1:C11. Expected `foo` to be at an indentation of 2 but was found at 11.',
          source: '{{#if foo}}foo{{else}}\n  bar\n{{/if}}',
          line: 1,
          column: 11,
        },
      ],
    },
    {
      template: ['{{#if foo}}', '  foo', '{{else}}', '    bar', '{{/if}}'].join('\n'),

      results: [
        {
          message:
            'Incorrect indentation for `bar\n` beginning at L4:C4. Expected `bar\n` to be at an indentation of 2 but was found at 4.',
          source: '{{#if foo}}\n  foo\n{{else}}\n    bar\n{{/if}}',
          line: 4,
          column: 4,
        },
      ],
    },
    {
      template: [
        '{{#if foo}}',
        '  foo',
        '{{else}}',
        '    {{#if bar}}',
        '      bar',
        '    {{/if}}',
        '{{/if}}',
      ].join('\n'),

      results: [
        {
          message:
            'Incorrect indentation for `{{#if}}` beginning at L4:C4. Expected `{{#if}}` to be at an indentation of 2 but was found at 4.',
          source: '{{#if foo}}\n  foo\n{{else}}\n    {{#if bar}}\n      bar\n    {{/if}}\n{{/if}}',
          line: 4,
          column: 4,
        },
      ],
    },
    {
      template: ['     {{#foo-bar}}', '     {{/foo-bar}}'].join('\n'),

      results: [
        {
          message:
            'Incorrect indentation for `{{#foo-bar}}` beginning at L1:C5. Expected `{{#foo-bar}}` to be at an indentation of 0, but was found at 5.',
          source: '{{#foo-bar}}\n     {{/foo-bar}}',
          line: 1,
          column: 5,
        },
      ],
    },
    {
      template: ['  <div>', '  </div>'].join('\n'),

      results: [
        {
          message:
            'Incorrect indentation for `<div>` beginning at L1:C2. Expected `<div>` to be at an indentation of 0, but was found at 2.',
          source: '<div>\n  </div>',
          line: 1,
          column: 2,
        },
      ],
    },
    {
      template: [
        '{{#foo bar as |foobar|}}',
        '   {{#foobar.baz}}{{/foobar.baz}}',
        '   {{foobar.baz}}',
        '{{/foo}}',
      ].join('\n'),

      results: [
        {
          column: 3,
          line: 2,
          message:
            'Incorrect indentation for `{{#foobar.baz}}` beginning at L2:C3. Expected `{{#foobar.baz}}` to be at an indentation of 2 but was found at 3.',
          rule: 'block-indentation',
          severity: 2,
          source:
            '{{#foo bar as |foobar|}}\n   {{#foobar.baz}}{{/foobar.baz}}\n   {{foobar.baz}}\n{{/foo}}',
        },
        {
          column: 3,
          line: 3,
          message:
            'Incorrect indentation for `{{foobar.baz}}` beginning at L3:C3. Expected `{{foobar.baz}}` to be at an indentation of 2 but was found at 3.',
          rule: 'block-indentation',
          severity: 2,
          source:
            '{{#foo bar as |foobar|}}\n   {{#foobar.baz}}{{/foobar.baz}}\n   {{foobar.baz}}\n{{/foo}}',
        },
      ],
    },
    {
      template: ['<div>', '<!-- Comment -->', '</div>'].join('\n'),
      results: [
        {
          column: 0,
          line: 2,
          message:
            'Incorrect indentation for `<!-- Comment -->` beginning at L2:C0. Expected `<!-- Comment -->` to be at an indentation of 2 but was found at 0.',
          rule: 'block-indentation',
          severity: 2,
          source: '<div>\n<!-- Comment -->\n</div>',
        },
      ],
    },
    {
      template: ['<div>', '{{! Comment }}', '</div>'].join('\n'),
      results: [
        {
          column: 0,
          line: 2,
          message:
            'Incorrect indentation for `{{! Comment }}` beginning at L2:C0. Expected `{{! Comment }}` to be at an indentation of 2 but was found at 0.',
          rule: 'block-indentation',
          severity: 2,
          source: '<div>\n{{! Comment }}\n</div>',
        },
      ],
    },
    {
      template: ['<div>', 'test{{! Comment }}', '</div>'].join('\n'),
      config: {
        ignoreComments: true,
      },
      results: [
        {
          column: 0,
          line: 1,
          message:
            'Incorrect indentation for `test` beginning at L1:C0. Expected `test` to be at an indentation of 2 but was found at 0.',
          rule: 'block-indentation',
          severity: 2,
          source: ['<div>', 'test{{! Comment }}', '</div>'].join('\n'),
        },
      ],
    },
  ],
});
