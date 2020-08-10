const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-aria-attributes-on-unsupported-elements',

  config: true,

  good: [
    '<div role="button"></div>',
    '<img role="option">',
    '<meta data-name="foo">',
    '<script src="noop"></script>',
    '<html title="noop"></html>',
  ],

  bad: [
    {
      template: '<meta role="button">',

      result: {
        message: 'meta tag must not contain "role" attribute',
        moduleId: 'layout.hbs',
        source: '<meta role="button">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<meta aria-foo="some-prop">',

      result: {
        message: 'meta tag must not contain "aria-foo" attribute',
        moduleId: 'layout.hbs',
        source: '<meta aria-foo="some-prop">',
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
      template: '<html role="button"></html>',

      result: {
        message: 'The html tag must not contain the "role" attribute',
        moduleId: 'layout.hbs',
        source: '<html role="button"></html>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<script role="template"></script>',

      result: {
        message: 'A script tag must not contain the "role" attribute',
        moduleId: 'layout.hbs',
        source: '<script role="template"></script>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<style role="style"></style>',

      result: {
        message: 'A style tag must not contain the "role" attribute',
        moduleId: 'layout.hbs',
        source: '<style role="style"></style>',
        line: 1,
        column: 0,
      },
    },
  ],
});
