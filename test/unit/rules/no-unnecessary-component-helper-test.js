import generateRuleTests from '../../helpers/rule-test-harness.js';

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

    // `if` expressions without `(component)` are allowed:
    '<Foo @arg={{if this.user.isAdmin "admin"}} />',

    // `if` expression with `(component)` are allowed:
    '<Foo @arg={{if this.user.isAdmin (component "my-component")}} />',

    // Component names of the form `addon-name@component-name` are exempt:
    "{{component 'addon-name@component-name'}}",
    "{{#component 'addon-name@component-name'}}{{/component}}",
  ],

  bad: [
    // MustacheStatement
    {
      template: '{{component "my-component-name" foo=123 bar=456}}',
      fixedTemplate: '{{my-component-name foo=123 bar=456}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 49,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Invoke component directly instead of using \`component\` helper",
              "rule": "no-unnecessary-component-helper",
              "severity": 2,
              "source": "{{component \\"my-component-name\\" foo=123 bar=456}}",
            },
          ]
        `);
      },
    },
    // BlockStatement:
    {
      template: '{{#component "my-component-name" foo=123 bar=456}}{{/component}}',
      fixedTemplate: '{{#my-component-name foo=123 bar=456}}{{/my-component-name}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 64,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Invoke component directly instead of using \`component\` helper",
              "rule": "no-unnecessary-component-helper",
              "severity": 2,
              "source": "{{#component \\"my-component-name\\" foo=123 bar=456}}{{/component}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '<Foo @arg={{component "allowed-component"}}>{{component "forbidden-component"}}</Foo>',
      fixedTemplate: '<Foo @arg={{component "allowed-component"}}>{{forbidden-component}}</Foo>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 44,
              "endColumn": 79,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Invoke component directly instead of using \`component\` helper",
              "rule": "no-unnecessary-component-helper",
              "severity": 2,
              "source": "{{component \\"forbidden-component\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
