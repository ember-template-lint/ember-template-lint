import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-unsupported-role-attributes',

  config: true,

  good: [
    '<div role="button" aria-disabled="true"></div>',
    '<div role="heading" aria-level="1" />',
    '<span role="checkbox" aria-checked={{this.checked}}></span>',
    '<CustomComponent role="banner" />',
    '<div role="textbox" aria-required={{this.required}} aria-errormessage={{this.error}}></div>',
    '<div role="heading" foo="true" />',
    '<dialog />',
    '<a href="#" aria-describedby=""></a>',
    '<menu type="toolbar" aria-hidden="true" />',
    '<a role="menuitem" aria-labelledby={{this.label}} />',
    '<input type="image" aria-atomic />',
    '<input type="submit" aria-disabled="true" />',
    '<select aria-expanded="false" aria-controls="ctrlID" />',
    '<div type="button" foo="true" />',
    '{{some-component role="heading" aria-level="2"}}',
    '{{other-component role=this.role aria-bogus="true"}}',
    '<ItemCheckbox @model={{@model}} @checkable={{@checkable}} />',
    '<some-custom-element />',
    '<input type="password">',
  ],

  bad: [
    {
      template: '<div role="link" href="#" aria-checked />',
      fixedTemplate: '<div role="link" href="#" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-checked is not supported by the role link",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<div role=\\"link\\" href=\\"#\\" aria-checked />",
            },
          ]
        `);
      },
    },
    {
      template: '<CustomComponent role="listbox" aria-level="2" />',
      fixedTemplate: '<CustomComponent role="listbox" />',

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
              "message": "The attribute aria-level is not supported by the role listbox",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<CustomComponent role=\\"listbox\\" aria-level=\\"2\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="option" aria-notreal="bogus" aria-selected="false" />',
      fixedTemplate: '<div role="option" aria-selected="false" />',

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
              "message": "The attribute aria-notreal is not supported by the role option",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<div role=\\"option\\" aria-notreal=\\"bogus\\" aria-selected=\\"false\\" />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="combobox" aria-multiline="true" aria-expanded="false" aria-controls="someId" />',
      fixedTemplate: '<div role="combobox" aria-expanded="false" aria-controls="someId" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 90,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-multiline is not supported by the role combobox",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<div role=\\"combobox\\" aria-multiline=\\"true\\" aria-expanded=\\"false\\" aria-controls=\\"someId\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" aria-valuetext="woosh"></button>',
      fixedTemplate: '<button type="submit"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 54,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-valuetext is not supported by the element button with the implicit role of button",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<button type=\\"submit\\" aria-valuetext=\\"woosh\\"></button>",
            },
          ]
        `);
      },
    },
    {
      template: '<menu type="toolbar" aria-expanded="true" />',
      fixedTemplate: '<menu type="toolbar" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-expanded is not supported by the element menu with the implicit role of list",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<menu type=\\"toolbar\\" aria-expanded=\\"true\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<a role="menuitem" aria-checked={{this.checked}} />',
      fixedTemplate: '<a role="menuitem" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-checked is not supported by the role menuitem",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<a role=\\"menuitem\\" aria-checked={{this.checked}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="button" aria-invalid="grammar" />',
      fixedTemplate: '<input type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 46,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-invalid is not supported by the element input with the implicit role of button",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<input type=\\"button\\" aria-invalid=\\"grammar\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="email" aria-level={{this.level}} />',
      fixedTemplate: '<input type="email" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-level is not supported by the element input with the implicit role of combobox",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "<input type=\\"email\\" aria-level={{this.level}} />",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo-component role="button" aria-valuetext="blahblahblah"}}',
      fixedTemplate: '{{foo-component role="button"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 61,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "The attribute aria-valuetext is not supported by the role button",
              "rule": "no-unsupported-role-attributes",
              "severity": 2,
              "source": "{{foo-component role=\\"button\\" aria-valuetext=\\"blahblahblah\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
