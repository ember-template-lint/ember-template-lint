'use strict';

const { messages } = require('../../../lib/rules/simple-unless');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'simple-unless',
  config: {
    allowlist: ['or', 'eq', 'not-eq'],
    maxHelpers: 2,
  },

  good: [
    "{{#unless isRed}}I'm blue, da ba dee da ba daa{{/unless}}",
    '<div class="{{unless foo \'no-foo\'}}"></div>',
    '<div class="{{if foo \'foo\'}}"></div>',
    '{{unrelated-mustache-without-params}}',
    '{{#if foo}}{{else}}{{/if}}',
    '{{#if foo}}{{else}}{{#unless bar}}{{/unless}}{{/if}}',
    '{{#if foo}}{{else}}{{unless bar someProperty}}{{/if}}',
    '{{#unless (or foo bar)}}order whiskey{{/unless}}',
    '{{#unless (eq (or foo bar) baz)}}order whiskey{{/unless}}',
    ['{{#unless hamburger}}', '  HOT DOG!', '{{/unless}}'].join('\n'),
    {
      config: true,
      template: '{{unless foo bar}}',
    },
    {
      config: {
        allowlist: ['or', 'eq', 'not-eq'],
        maxHelpers: 2,
      },
      template: '{{unless (eq foo bar) baz}}',
    },
    {
      config: {
        allowlist: [],
        maxHelpers: 2,
      },
      template: '{{unless (eq (not foo) bar) baz}}',
    },
    {
      config: {
        maxHelpers: 2,
      },
      template: '{{unless (eq (not foo) bar) baz}}',
    },
    {
      config: {
        maxHelpers: -1,
      },
      template: '{{unless (eq (not foo) bar) baz}}',
    },
    {
      config: {
        maxHelpers: -1,
        denylist: [],
      },
      template: '{{unless (eq (not foo) bar) baz}}',
    },
    {
      config: {
        maxHelpers: -1,
        denylist: ['or'],
      },
      template: '{{unless (eq (not foo) bar) baz}}',
    },
  ],

  bad: [
    {
      config: {
        allowlist: ['or', 'eq', 'not-eq'],
        maxHelpers: 2,
      },
      template: "{{unless (if (or true))  'Please no'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. Allowed helpers: or,eq,not-eq",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (if ...",
            },
          ]
        `);
      },
    },
    {
      template: "{{unless (if true)  'Please no'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. Allowed helpers: or,eq,not-eq",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (if ...",
            },
          ]
        `);
      },
    },
    {
      template: "{{unless (and isBad isAwful)  'notBadAndAwful'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. Allowed helpers: or,eq,not-eq",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (and ...",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else}}",
            },
          ]
        `);
      },
    },
    {
      template: ['{{#unless bandwagoner}}', '{{else}}', '{{/unless}}'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else}}",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '{{else}}',
        '  {{#my-component}}',
        '  {{/my-component}}',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else}}",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goHawks}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else if goHawks}}",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goPats}}',
        '  Tom Brady is GOAT',
        '{{else if goHawks}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else if goPats}}",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goBengals}}',
        '  Ouch, sorry',
        '{{else}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else if goBengals}}",
            },
          ]
        `);
      },
    },
    {
      template: ['{{#if dog}}', '  Ruff Ruff!', '{{else unless cat}}', '  not cat', '{{/if}}'].join(
        '\n'
      ),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Using an \`{{else unless}}\` block should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else unless ...",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless (and isFruit isYellow)}}',
        '  I am a green celery!',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. Allowed helpers: or,eq,not-eq",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (and ...",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless (not isBrown isSticky)}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. Allowed helpers: or,eq,not-eq",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (not ...",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless isSticky}}',
        '  I think I am a brown stick',
        '{{else}}',
        '  Not a brown stick',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Using an {{else}} block with {{unless}} should be avoided.",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{else}}",
            },
          ]
        `);
      },
    },
    {
      template: [
        '{{#unless (or (eq foo bar) (not-eq baz "beer"))}}',
        '  MUCH HELPERS, VERY BAD',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 27,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. MaxHelpers: 2",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (... (not-eq ...",
            },
          ]
        `);
      },
    },
    {
      config: true,
      template: [
        '{{#unless (concat "blue" "red")}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. MaxHelpers: 0",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (concat ...",
            },
          ]
        `);
      },
    },
    {
      config: {
        allowlist: ['test'],
        maxHelpers: 1,
      },
      template: [
        '{{#unless (one (test power) two)}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),

      results: [
        {
          message:
            'Using {{unless}} in combination with other helpers should be avoided. Allowed helper: test',
          source: '{{unless (one ...',
          line: 1,
          column: 10,
        },
        {
          message:
            'Using {{unless}} in combination with other helpers should be avoided. MaxHelpers: 1',
          source: '{{unless (... (test ...',
          line: 1,
          column: 15,
        },
      ],
    },
    {
      config: {
        allowlist: [],
        maxHelpers: 2,
      },
      template: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 27,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. MaxHelpers: 2",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (... (four ...",
            },
          ]
        `);
      },
    },
    {
      config: {
        denylist: ['two'],
        maxHelpers: -1,
      },
      template: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 15,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Using {{unless}} in combination with other helpers should be avoided. Restricted helper: two",
              "rule": "simple-unless",
              "severity": 2,
              "source": "{{unless (... (two ...",
            },
          ]
        `);
      },
    },
    {
      config: {
        denylist: ['two', 'four'],
        maxHelpers: -1,
      },
      template: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),

      results: [
        {
          message:
            'Using {{unless}} in combination with other helpers should be avoided. Restricted helpers: two,four',
          source: '{{unless (... (two ...',
          line: 1,
          column: 15,
        },
        {
          message:
            'Using {{unless}} in combination with other helpers should be avoided. Restricted helpers: two,four',
          source: '{{unless (... (four ...',
          line: 1,
          column: 27,
        },
      ],
    },
  ],
});
