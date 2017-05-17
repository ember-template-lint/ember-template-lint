'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'link-rel-noopener',

  config: true,

  good: [
    '<a href="/some/where"></a>',
    '<a href="/some/where" target="_self"></a>',
    '<a href="/some/where" target="_blank" rel="noopener"></a>',
    '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
    '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
    {
      config: 'strict',
      template: '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a>,'
    }
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
    },
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="noopener"></a>',

      result: {
        rule: 'link-rel-noopener',
        message: 'links with target="_blank" must have rel="noopener noreferrer"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="noopener"></a>',
        line: 1,
        column: 0
      }
    },
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',

      result: {
        rule: 'link-rel-noopener',
        message: 'links with target="_blank" must have rel="noopener noreferrer"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
        line: 1,
        column: 0
      }
    },
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',

      result: {
        rule: 'link-rel-noopener',
        message: 'links with target="_blank" must have rel="noopener noreferrer"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0
      }
    }
  ]
});
