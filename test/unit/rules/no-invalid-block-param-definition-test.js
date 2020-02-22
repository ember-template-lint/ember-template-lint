'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-block-param-definition',

  config: true,

  good: [
    '<MyComponent as |foo|>{{foo}}</MyComponent>',
    `<FooBar 
as |boo|>{{boo}}</FooBar>
`,
    `<FooBar 
as | boo |>{{boo}}</FooBar>
`,
    `<FooBar 
as 
|boo|
>{{boo}}</FooBar>
`,
    `<FooBar 
as 
| boo |
  >{{boo}}</FooBar>
`,
  ],

  bad: [
    {
      template: '<Foo |a></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo |a>". Missing " as " keyword before block symbol "|". Missing second (closing) "|" block symbol.',
        source: '<Foo |a>',
      },
    },
    {
      template: '<Foo | a></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo | a>". Missing " as " keyword before block symbol "|".',
        source: '<Foo | a>',
      },
    },
    {
      template: '<Foo |a|></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo |a|>". Missing " as " keyword before block symbol "|".',
        source: '<Foo |a|>',
      },
    },
    {
      template: '<Foo | a |></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo | a |>". Missing " as " keyword before block symbol "|".',
        source: '<Foo | a |>',
      },
    },
    {
      template: '<Foo | a |></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo | a |>". Missing " as " keyword before block symbol "|".',
        source: '<Foo | a |>',
      },
    },
    {
      template: '<Foo a|></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo a|>". Missing " as " keyword before block symbol "|". Missing "|" block symbol after " as " keyword.',
        source: '<Foo a|>',
      },
    },
    {
      template: '<Foo a |></Foo>',
      result: {
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        message:
          'Unexpected block usage in "<Foo a |>". Missing " as " keyword before block symbol "|".',
        source: '<Foo a |>',
      },
    },
  ],
});
