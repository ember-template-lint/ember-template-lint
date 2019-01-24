const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'aria-unsupported-elements',

  config: true,

  good: ['<div role="main-navigation"></div>', '<img aria-role="some-role">'],

  bad: [
    {
      template: '<meta role>',

      result: {
        message: 'meta tag must not contain "role" attribute',
        moduleId: 'layout.hbs',
        source: '<meta role>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<meta aria-foo>',

      result: {
        message: 'meta tag must not contain "aria-foo" attribute',
        moduleId: 'layout.hbs',
        source: '<meta aria-foo>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<meta role="name">',

      result: {
        message: 'meta tag must not contain "role" attribute',
        moduleId: 'layout.hbs',
        source: '<meta role="name">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<html role></html>',

      result: {
        message: 'html tag must not contain "role" attribute',
        moduleId: 'layout.hbs',
        source: '<html role></html>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<script role></script>',

      result: {
        message: 'script tag must not contain "role" attribute',
        moduleId: 'layout.hbs',
        source: '<script role></script>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<style role></style>',

      result: {
        message: 'style tag must not contain "role" attribute',
        moduleId: 'layout.hbs',
        source: '<style role></style>',
        line: 1,
        column: 0,
      },
    },
  ],
});
