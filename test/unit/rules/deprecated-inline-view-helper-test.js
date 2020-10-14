'use strict';

const { DEPRECATION_URL } = require('../../../lib/rules/deprecated-inline-view-helper');
const generateRuleTests = require('../../helpers/rule-test-harness');

const message =
  // eslint-disable-next-line prefer-template
  'The inline form of `view` is deprecated. Please use the `Ember.Component` instead. ' +
  'See the deprecation guide at ' +
  DEPRECATION_URL;

generateRuleTests({
  name: 'deprecated-inline-view-helper',

  config: true,

  good: [
    '{{great-fishsticks}}',
    '{{input placeholder=(t "email") value=email}}',
    '{{title "CrossCheck Web" prepend=true separator=" | "}}',
    '{{false}}',
    '{{"foo"}}',
    '{{42}}',
    '{{null}}',
    '{{undefined}}',
  ],

  bad: [
    {
      template: "{{view 'awful-fishsticks'}}",

      result: {
        message,
        source: "{{view 'awful-fishsticks'}}",
        line: 1,
        column: 0,
        fix: {
          text: '{{awful-fishsticks}}',
        },
      },
    },
    {
      template: '{{view.bad-fishsticks}}',

      result: {
        message,
        source: '{{view.bad-fishsticks}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{bad-fishsticks}}',
        },
      },
    },
    {
      template: '{{view.terrible.fishsticks}}',

      result: {
        message,
        source: '{{view.terrible.fishsticks}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{terrible.fishsticks}}',
        },
      },
    },
    {
      template: '{{foo-bar bab=good baz=view.qux.qaz boo=okay}}',

      result: {
        message,
        source: '{{foo-bar baz=view.qux.qaz}}',
        line: 1,
        column: 19,
        fix: {
          text: '{{foo-bar baz=qux.qaz}}',
        },
      },
    },
    {
      template: '<div class="whatever-class" data-foo={{view.hallo}} sure=thing></div>',

      result: {
        message,
        source: '<div data-foo={{view.hallo}}></div>',
        line: 1,
        column: 0,
        fix: {
          text: '<div data-foo={{hallo}}></div>',
        },
      },
    },
    {
      template: '{{#foo-bar derp=view.whoops thing=whatever}}{{/foo-bar}}',

      result: {
        message,
        source: '{{#foo-bar derp=view.whoops}}{{/foo-bar}}',
        line: 1,
        column: 11,
        fix: {
          text: '{{#foo-bar derp=whoops}}{{/foo-bar}}',
        },
      },
    },
  ],
});
