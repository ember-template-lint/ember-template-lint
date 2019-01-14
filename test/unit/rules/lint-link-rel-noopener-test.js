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
    '<a href="/some/where" target="_blank" rel="noreferrer noopener"></a>',
    '<a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a>',
    '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
    {
      config: 'strict',
      template: '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a>,',
    },
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="nofollow noopener noreferrer"></a>,',
    },
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="noopener nofollow noreferrer"></a>,',
    },
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer nofollow"></a>,',
    },
    {
      config: 'strict',
      template: '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener"></a>,',
    },
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="nofollow noreferrer noopener"></a>,',
    },
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="noreferrer nofollow noopener"></a>,',
    },
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a>,',
    },
  ],

  bad: [
    {
      template: '<a href="/some/where" target="_blank"></a>',

      result: {
        message: 'links with target="_blank" must have rel="noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',

      result: {
        message: 'links with target="_blank" must have rel="noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="noopener"></a>',

      result: {
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="noopener"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',

      result: {
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',

      result: {
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        moduleId: 'layout.hbs',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0,
      },
    },
  ],
});
