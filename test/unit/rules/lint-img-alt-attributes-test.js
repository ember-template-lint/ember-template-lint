'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'img-alt-attributes',

  config: true,

  good: [
    '<img alt="hullo">'
  ],

  bad: [
    {
      template: '<img>',

      result: {
        rule: 'img-alt-attributes',
        message: 'img tags must have an alt attribute',
        moduleId: 'layout.hbs',
        source: '<img>',
        line: 1,
        column: 0
      }
    },
    {
      template: '<img alt>',

      result: {
        rule: 'img-alt-attributes',
        message: 'img tags must have an alt attribute',
        moduleId: 'layout.hbs',
        source: '<img alt>',
        line: 1,
        column: 0
      }
    },
    {
      template: '<img alt="">',

      result: {
        rule: 'img-alt-attributes',
        message: 'img tags must have an alt attribute',
        moduleId: 'layout.hbs',
        source: '<img alt="">',
        line: 1,
        column: 0
      }
    }
  ]
});
