'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const messages = require('../../../lib/rules/lint-simple-unless').messages;

generateRuleTests({
  name: 'simple-unless',
  config: {
    whitelist: ['or', 'eq', 'not-eq'],
    maxHelpers: 2
  },

  good: [
    '{{#unless isRed}}I\'m blue, da ba dee da ba daa{{/unless}}',
    '<div class="{{unless foo \'no-foo\'}}"></div>',
    '<div class="{{if foo \'foo\'}}"></div>',
    '{{unrelated-mustache-without-params}}',
    '{{#if foo}}{{else}}{{/if}}',
    '{{#unless (or foo bar)}}order whiskey{{/unless}}',
    '{{#unless (eq (or foo bar) baz)}}order whiskey{{/unless}}',
    [
      '{{#unless hamburger}}',
      '  HOT DOG!',
      '{{/unless}}'
    ].join('\n')
  ],

  bad: [
    {
      template: '{{unless (if (or true))  \'Please no\'}}',

      result: {
        message: messages.withHelper + ' Allowed helpers: or,eq,not-eq',
        moduleId: 'layout.hbs',
        source: '{{unless (if ...',
        line: 1,
        column: 9
      }
    },
    {
      template: '{{unless (if true)  \'Please no\'}}',

      result: {
        message: messages.withHelper + ' Allowed helpers: or,eq,not-eq',
        moduleId: 'layout.hbs',
        source: '{{unless (if ...',
        line: 1,
        column: 9
      }
    },
    {
      template: '{{unless (and isBad isAwful)  \'notBadAndAwful\'}}',

      result: {
        message: messages.withHelper + ' Allowed helpers: or,eq,not-eq',
        moduleId: 'layout.hbs',
        source: '{{unless (and ...',
        line: 1,
        column: 9
      }
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else}}',
        '  Go Seahawks!',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.followingElseBlock,
        moduleId: 'layout.hbs',
        source: '{{else}}',
        line: 3,
        column: 0
      }
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goHawks}}',
        '  Go Seahawks!',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.followingElseBlock,
        moduleId: 'layout.hbs',
        source: '{{else if goHawks}}',
        line: 3,
        column: 0
      }
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goPats}}',
        '  Tom Brady is GOAT',
        '{{else if goHawks}}',
        '  Go Seahawks!',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.followingElseBlock,
        moduleId: 'layout.hbs',
        source: '{{else if goPats}}',
        line: 3,
        column: 0
      }
    },
    {
      template: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goBengals}}',
        '  Ouch, sorry',
        '{{else}}',
        '  Go Seahawks!',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.followingElseBlock,
        moduleId: 'layout.hbs',
        source: '{{else if goBengals}}',
        line: 3,
        column: 0
      }
    },
    {
      template: [
        '{{#if dog}}',
        '  Ruff Ruff!',
        '{{else unless cat}}',
        '  not cat',
        '{{/if}}'
      ].join('\n'),

      result: {
        message: messages.asElseUnlessBlock,
        moduleId: 'layout.hbs',
        source: '{{else unless ...',
        line: 3,
        column: 0
      }
    },
    {
      template: [
        '{{#unless (and isFruit isYellow)}}',
        '  I am a green celery!',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.withHelper + ' Allowed helpers: or,eq,not-eq',
        moduleId: 'layout.hbs',
        source: '{{unless (and ...',
        line: 1,
        column: 10
      }
    },
    {
      template: [
        '{{#unless (not isBrown isSticky)}}',
        '  I think I am a brown stick',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.withHelper + ' Allowed helpers: or,eq,not-eq',
        moduleId: 'layout.hbs',
        source: '{{unless (not ...',
        line: 1,
        column: 10
      }
    },
    {
      template: [
        '{{#unless isSticky}}',
        '  I think I am a brown stick',
        '{{else}}',
        '  Not a brown stick',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.followingElseBlock,
        moduleId: 'layout.hbs',
        source: '{{else}}',
        line: 3,
        column: 0
      }
    },{
      template: [
        '{{#unless (or (eq foo bar) (not-eq baz "beer"))}}',
        '  MUCH HELPERS, VERY BAD',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.withHelper + ' MaxHelpers: 2',
        moduleId: 'layout.hbs',
        source: '{{unless (... (not-eq ...',
        line: 1,
        column: 27
      }
    },{
      config: ['exampleHelper'],
      template: [
        '{{#unless (concat "blue" "red")}}',
        '  I think I am a brown stick',
        '{{/unless}}'
      ].join('\n'),

      result: {
        message: messages.withHelper + ' Allowed helper: exampleHelper',
        moduleId: 'layout.hbs',
        source: '{{unless (concat ...',
        line: 1,
        column: 10
      }
    }
  ]
});
