'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'link-rel-noopener',

  config: true,

  good: [
    {
      config: 'loose',
      template: '<a href="/some/where"></a>',
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_self"></a>',
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank" rel="noopener"></a>',
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank" rel="noreferrer noopener"></a>',
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a>',
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
    },
    '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="nofollow noopener noreferrer"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener nofollow noreferrer"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer nofollow"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="nofollow noreferrer noopener"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer nofollow noopener"></a>,',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a>,',
    // `config: strict` should act the same as default (`config: true`)
    {
      config: 'strict',
      template:
        '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a>,',
    },
  ],

  bad: [
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="noopener"></a>',

      result: {
        isFixable: true,
        message: 'links with target="_blank" must have rel="noopener"',
        source: '<a href="/some/where" target="_blank"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      config: 'loose',
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="nofollow noopener"></a>',

      result: {
        isFixable: true,
        message: 'links with target="_blank" must have rel="noopener"',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="noopener"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',

      result: {
        isFixable: true,
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        source: '<a href="/some/where" target="_blank" rel="noopener"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',

      result: {
        isFixable: true,
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        source: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
      fixedTemplate:
        '<a href="/some/where" target="_blank" rel="nofollow noopener noreferrer"></a>',

      result: {
        isFixable: true,
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0,
      },
    },
    // `config: strict` should act the same as default (`config: true`) for fixer
    {
      config: 'strict',
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
      fixedTemplate:
        '<a href="/some/where" target="_blank" rel="nofollow noopener noreferrer"></a>',

      result: {
        isFixable: true,
        message:
          'links with target="_blank" must have rel="noopener noreferrer" or rel="noreferrer noopener"',
        source: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
        line: 1,
        column: 0,
      },
    },
  ],
});
