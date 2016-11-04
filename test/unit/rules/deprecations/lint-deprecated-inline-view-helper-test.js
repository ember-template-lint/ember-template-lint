'use strict';

var generateRuleTests = require('../../../helpers/rule-test-harness');
var DEPRECATION_URL = require('../../../../lib/rules/deprecations/lint-deprecated-inline-view-helper').DEPRECATION_URL;

var message = 'The inline form of `view` is deprecated. Please use the `Ember.Component` instead. ' +
  'See the deprecation guide at ' + DEPRECATION_URL;

generateRuleTests({
  name: 'deprecated-inline-view-helper',

  config: true,

  good: [
    {
      template: '{{great-fishsticks}}'
    }
  ],

  bad: [
    {
      template: '{{view \'awful-fishsticks\'}}',

      result: {
        rule: 'deprecated-inline-view-helper',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{view \'awful-fishsticks\'}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{awful-fishsticks}}'
        }
      }
    },
    {
      template: '{{view.bad-fishsticks}}',

      result: {
        rule: 'deprecated-inline-view-helper',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{view.bad-fishsticks}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{bad-fishsticks}}'
        }
      }
    },
    {
      template: '{{view.terrible.fishsticks}}',

      result: {
        rule: 'deprecated-inline-view-helper',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{view.terrible.fishsticks}}',
        line: 1,
        column: 0,
        fix: {
          text: '{{terrible.fishsticks}}'
        }
      }
    },
    {
      template: '{{foo-bar bab=good baz=view.qux.qaz boo=okay}}',

      result: {
        rule: 'deprecated-inline-view-helper',
        message: message,
        moduleId: 'layout.hbs',
        source: '{{foo-bar baz=view.qux.qaz}}',
        line: 1,
        column: 19,
        fix: {
          text: '{{foo-bar baz=qux.qaz}}'
        }
      }
    },
    {
      template: '<div class="whatever-class" data-foo={{view.hallo}} sure=thing></div>',

      result: {
        rule: 'deprecated-inline-view-helper',
        message: message,
        moduleId: 'layout.hbs',
        source: '<div data-foo={{view.hallo}}></div>',
        line: 1,
        column: 0,
        fix: {
          text: '<div data-foo={{hallo}}></div>'
        }
      }
    }
  ]
});
