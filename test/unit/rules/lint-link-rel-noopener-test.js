'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'link-rel-noopener',

  config: true,

  good: [
    '<a href="/some/where"></a>',
    '<a href="/some/where" target="_self"></a>',
    '<a href="/some/where" target="_blank" rel="noopener"></a>'
  ],

  bad: [
    {
      template: '<a href="/some/where" target="_blank"></a>',

      result: {
        rule: 'link-rel-noopener',
        message: 'links with target="_blank" must have rel="noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank"></a>',
        line: 1,
        column: 0
      }
    },
    {
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',

      result: {
        rule: 'link-rel-noopener',
        message: 'links with target="_blank" must have rel="noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0
      }
    }
  ]
});
