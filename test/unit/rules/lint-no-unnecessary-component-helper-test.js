'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/lint-no-unnecessary-component-helper');

const { ERROR_MESSAGE } = rule;

generateRuleTests({
  name: 'no-unnecessary-component-helper',

  config: true,

  good: [
    // MustacheStatement
    '{{component SOME_COMPONENT_NAME}}',
    '{{component SOME_COMPONENT_NAME SOME_ARG}}',
    '{{component SOME_COMPONENT_NAME "Hello World"}}',
    '{{my-component}}',
    '{{my-component "Hello world"}}',
    '{{my-component "Hello world" 123}}',

    // BlockStatement:
    '{{#component SOME_COMPONENT_NAME}}{{/component}}',
    '{{#component SOME_COMPONENT_NAME SOME_ARG}}{{/component}}',
    '{{#component SOME_COMPONENT_NAME "Hello World"}}{{/component}}',
    '{{#my-component}}{{/my-component}}',
    '{{#my-component "Hello world"}}{{/my-component}}',
    '{{#my-component "Hello world" 123}}{{/my-component}}',

    // Inline usage is not affected by this rule:
    '(component SOME_COMPONENT_NAME)',
    '(component "my-component")',

    // Curly inline usage in an angle bracket component:
    '<Foo @bar={{component SOME_COMPONENT_NAME}} />',
    '<Foo @bar={{component "my-component"}} />',
    '<Foo @bar={{component SOME_COMPONENT_NAME}}></Foo>',
    '<Foo @bar={{component "my-component"}}></Foo>',

    // Static arguments in angle bracket components don't crash the rule:
    '<Foo @arg="foo" />',
    '<Foo class="foo" />',
    '<Foo data-test-bar="foo" />',

    // `if` expressions are allowed
    '<Foo @arg={{if this.user.isAdmin "admin"}}/>',

    // Component names of the form `addon-name@component-name` are exempt:
    "{{component 'addon-name@component-name'}}",
    "{{#component 'addon-name@component-name'}}{{/component}}",
  ],

  bad: [
    // MustacheStatement
    {
      template: '{{component "my-component-name"}}',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '{{component "my-component-name"}}',
        line: 1,
        column: 0,
      },
    },
    // BlockStatement:
    {
      template: '{{#component "my-component-name"}}{{/component}}',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: '{{#component "my-component-name"}}{{/component}}',
        line: 1,
        column: 0,
      },
    },
  ],
});
