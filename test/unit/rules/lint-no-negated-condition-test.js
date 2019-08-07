'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/lint-no-negated-condition');

const { ERROR_MESSAGE_FLIP_IF, ERROR_MESSAGE_USE_IF, ERROR_MESSAGE_USE_UNLESS } = rule;

generateRuleTests({
  name: 'no-negated-condition',

  config: true,

  good: [
    // ******************************************
    // BlockStatement
    // ******************************************

    // if ...
    '{{#if condition}}<img>{{/if}}',
    '{{#if (or c1 c2)}}{{/if}}',
    '{{#if (not (or c1 c2))}}{{/if}}', // Valid since we don't want to suggest `unless` with helpers in the condition.

    // if ... else ...
    '{{#if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (or c1 c2)}}<img>{{else}}<img>{{/if}}',

    // if ... else if ...
    '{{#if condition}}<img>{{else if condition}}<img>{{/if}}',
    '{{#if condition}}<img>{{else if (not condition2)}}<img>{{/if}}', // we ignore `if ... else if ...`
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{/if}}', // we ignore `if ... else if ...`

    // if ... else if ... else ...
    '{{#if condition}}<img>{{else if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{else}}<img>{{/if}}', // we ignore `if ... else if ...`

    // unless ...
    '{{#unless condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{/unless}}',

    // unless ... else ...
    '{{#unless condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else}}<img>{{/unless}}',

    // unless ... else if ...
    '{{#unless condition}}<img>{{else if condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{/unless}}',

    // unless ... else if ... else ...
    '{{#unless condition}}<img>{{else if condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{else}}<img>{{/unless}}',

    // ******************************************
    // MustacheStatement
    // ******************************************

    // if ...
    '<img class={{if condition "some-class"}}>',
    '<img class={{if (or c1 c2) "some-class"}}>',
    '<img class={{if (not (or c1 c2)) "some-class"}}>', // Valid since we don't want to suggest `unless` with helpers in the condition.

    // if ... else ...
    '<img class={{if condition "some-class" "other-class"}}>',
    '<img class={{if (or c1 c2) "some-class" "other-class"}}>',

    // unless ...
    '<img class={{unless condition "some-class"}}>',
    '<img class={{unless (or c1 c2) "some-class"}}>',

    // unless ... else ...
    '<img class={{unless condition "some-class" "other-class"}}>',
    '<img class={{unless (or c1 c2) "some-class" "other-class"}}>',

    // ******************************************
    // SubExpression
    // ******************************************

    // if ...
    '{{input class=(if condition "some-class")}}',
    '{{input class=(if (or c1 c2) "some-class")}}',
    '{{input class=(if (not (or c1 c2)) "some-class")}}', // Valid since we don't want to suggest `unless` with helpers in the condition.

    // if ... else ...
    '{{input class=(if condition "some-class" "other-class")}}',
    '{{input class=(if (or c1 c2) "some-class" "other-class")}}',

    // unless ...
    '{{input class=(unless condition "some-class")}}',
    '{{input class=(unless (or c1 c2) "some-class")}}',

    // unless ... else ...
    '{{input class=(unless condition "some-class" "other-class")}}',
    '{{input class=(unless (or c1 c2) "some-class" "other-class")}}',
  ],

  bad: [
    // ******************************************
    // BlockStatement
    // ******************************************

    // if ...
    {
      template: '{{#if (not condition)}}<img>{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        moduleId: 'layout.hbs',
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 0,
      },
    },

    // if ... else ...
    {
      template: '{{#if (not condition)}}<img>{{else}}<img>{{/if}}',

      result: {
        message: ERROR_MESSAGE_FLIP_IF,
        moduleId: 'layout.hbs',
        source: '{{#if (not condition)}}<img>{{else}}<img>{{/if}}',
        line: 1,
        column: 0,
      },
    },

    // unless ...
    {
      template: '{{#unless (not condition)}}<img>{{/unless}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '{{#unless (not condition)}}<img>{{/unless}}',
        line: 1,
        column: 0,
      },
    },

    // unless ... else ...
    {
      template: '{{#unless (not condition)}}<img>{{else}}<img>{{/unless}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '{{#unless (not condition)}}<img>{{else}}<img>{{/unless}}',
        line: 1,
        column: 0,
      },
    },

    // unless ... else if ...
    {
      template: '{{#unless (not condition)}}<img>{{else if (not condition)}}<img>{{/unless}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '{{#unless (not condition)}}<img>{{else if (not condition)}}<img>{{/unless}}',
        line: 1,
        column: 0,
      },
    },

    // unless ... else if ... else ...
    {
      template:
        '{{#unless (not condition)}}<img>{{else if (not condition)}}<img>{{else}}<img>{{/unless}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source:
          '{{#unless (not condition)}}<img>{{else if (not condition)}}<img>{{else}}<img>{{/unless}}',
        line: 1,
        column: 0,
      },
    },

    // Nested inside the body of an `else` block (with preceding comment):
    {
      template:
        '{{#if condition}}{{else}}{{! some comment }}{{#if (not condition)}}<img>{{/if}}{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        moduleId: 'layout.hbs',
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 44,
      },
    },

    // Nested inside the body of an `else` block (without preceding comment):
    {
      template: '{{#if condition}}{{else}}{{#if (not condition)}}<img>{{/if}}{{/if}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        moduleId: 'layout.hbs',
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 25,
      },
    },

    // ******************************************
    // MustacheStatement
    // ******************************************

    // if ...
    {
      template: '<img class={{if (not condition) "some-class"}}>',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        moduleId: 'layout.hbs',
        source: '{{if (not condition) "some-class"}}',
        line: 1,
        column: 11,
      },
    },

    // if ... else ...
    {
      template: '<img class={{if (not condition) "some-class" "other-class"}}>',

      result: {
        message: ERROR_MESSAGE_FLIP_IF,
        moduleId: 'layout.hbs',
        source: '{{if (not condition) "some-class" "other-class"}}',
        line: 1,
        column: 11,
      },
    },

    // unless ...
    {
      template: '<img class={{unless (not condition) "some-class"}}>',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '{{unless (not condition) "some-class"}}',
        line: 1,
        column: 11,
      },
    },

    // unless ... else ...
    {
      template: '<img class={{unless (not condition) "some-class" "other-class"}}>',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '{{unless (not condition) "some-class" "other-class"}}',
        line: 1,
        column: 11,
      },
    },

    // ******************************************
    // SubExpression
    // ******************************************

    // if ...
    {
      template: '{{input class=(if (not condition) "some-class")}}',

      result: {
        message: ERROR_MESSAGE_USE_UNLESS,
        moduleId: 'layout.hbs',
        source: '(if (not condition) "some-class")',
        line: 1,
        column: 14,
      },
    },

    // if ... else ...
    {
      template: '{{input class=(if (not condition) "some-class" "other-class")}}',

      result: {
        message: ERROR_MESSAGE_FLIP_IF,
        moduleId: 'layout.hbs',
        source: '(if (not condition) "some-class" "other-class")',
        line: 1,
        column: 14,
      },
    },

    // unless ...
    {
      template: '{{input class=(unless (not condition) "some-class")}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '(unless (not condition) "some-class")',
        line: 1,
        column: 14,
      },
    },

    // unless ... else ...
    {
      template: '{{input class=(unless (not condition) "some-class" "other-class")}}',

      result: {
        message: ERROR_MESSAGE_USE_IF,
        moduleId: 'layout.hbs',
        source: '(unless (not condition) "some-class" "other-class")',
        line: 1,
        column: 14,
      },
    },
  ],
});
