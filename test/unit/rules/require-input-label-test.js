import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-input-label',

  config: true,

  good: [
    '<label>LabelText<input /></label>',
    '<label>LabelText<input id="foo" /></label>',
    '<label><input />LabelText</label>',
    '<label>LabelText<Input /></label>',
    '<label><Input />LabelText</label>',
    '<label>Label Text<div><input /></div></label>', // technically okay, hopefully no one does this though
    '<input id="probablyHasLabel" />', // it's likely to have an associated label if it has an id attribute
    '<input aria-label={{labelText}} />',
    '<input aria-labelledby="someIdValue" />',
    '<div></div>',
    '<input ...attributes/>', // we are unable to correctly determine if this has a label or not, so we have to allow it
    '<Input ...attributes />',
    '<Input id="foo" />',
    '<label>text<Input id="foo" /></label>',
    '{{input id="foo"}}',
    '<label>text{{input id="foo"}}</label>',
    '<label>Text here<Input /></label>',
    '<label>Text here {{input}}</label>',
    '<input id="label-input" ...attributes>',

    // Same logic applies to textareas
    '<label>LabelText<textarea /></label>',
    '<label><textarea />LabelText</label>',
    '<label>LabelText<Textarea /></label>',
    '<label><Textarea />LabelText</label>',
    '<label>Label Text<div><textarea /></div></label>', // technically okay, hopefully no one does this though
    '<textarea id="probablyHasLabel" />', // it's likely to have an associated label if it has an id attribute
    '<textarea aria-label={{labelText}} />',
    '<textarea aria-labelledby="someIdValue" />',
    '<textarea ...attributes/>', // we are unable to correctly determine if this has a label or not, so we have to allow it
    '<Textarea ...attributes />',
    '<Textarea id="foo" />',
    '{{textarea id="foo"}}',
    '<label>Text here<Textarea /></label>',
    '<label>Text here {{textarea}}</label>',
    '<textarea id="label-input" ...attributes />',

    // Same logic applies to select menus
    '<label>LabelText<select></select></label>',
    '<label><select></select>LabelText</label>',
    '<label>Label Text<div><select></select></div></label>', // technically okay, hopefully no one does this though
    '<select id="probablyHasLabel" ></select>', // it's likely to have an associated label if it has an id attribute
    '<select aria-label={{labelText}} ></select>',
    '<select aria-labelledby="someIdValue" ></select>',
    '<select ...attributes></select>', // we are unable to correctly determine if this has a label or not, so we have to allow it
    '<select id="label-input" ...attributes ></select>',

    // Hidden inputs are allowed.
    '<input type="hidden"/>',
    '<Input type="hidden" />',
    '{{input type="hidden"}}',

    {
      config: { labelTags: ['CustomLabel'] },
      template: '<CustomLabel><input /></CustomLabel>',
    },
    {
      config: { labelTags: [/web-label/] },
      template: '<web-label><input /></web-label>',
    },
  ],

  bad: [
    {
      config: { labelTags: [/web-label/] },
      template: '<my-label><input /></my-label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input />",
            },
          ]
        `);
      },
    },
    {
      template: '<div><input /></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input />",
            },
          ]
        `);
      },
    },
    {
      template: '<input />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input />",
            },
          ]
        `);
      },
    },
    {
      template: '<input title="some title value" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input title=\\"some title value\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<label><input></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input>",
            },
          ]
        `);
      },
    },
    {
      template: '<div>{{input}}</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "{{input}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Input/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<Input/>",
            },
          ]
        `);
      },
    },
    {
      template: '<input aria-label="first label" aria-labelledby="second label">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input aria-label=\\"first label\\" aria-labelledby=\\"second label\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<input id="label-input" aria-label="second label">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input id=\\"label-input\\" aria-label=\\"second label\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<label>Input label<input aria-label="Custom label"></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 18,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input aria-label=\\"Custom label\\">",
            },
          ]
        `);
      },
    },
    {
      template: '{{input type="button"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "{{input type=\\"button\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{input type=myType}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "{{input type=myType}}",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="button"/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input type=\\"button\\"/>",
            },
          ]
        `);
      },
    },
    {
      template: '<input type={{myType}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<input type={{myType}}/>",
            },
          ]
        `);
      },
    },
    {
      template: '<Input type="button"/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<Input type=\\"button\\"/>",
            },
          ]
        `);
      },
    },
    {
      template: '<Input type={{myType}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<Input type={{myType}}/>",
            },
          ]
        `);
      },
    },
    {
      template: '<div><textarea /></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea />",
            },
          ]
        `);
      },
    },
    {
      template: '<textarea />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 12,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea />",
            },
          ]
        `);
      },
    },
    {
      template: '<textarea title="some title value" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea title=\\"some title value\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<label><textarea /></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea />",
            },
          ]
        `);
      },
    },
    {
      template: '<div>{{textarea}}</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "{{textarea}}",
            },
          ]
        `);
      },
    },
    {
      template: '<Textarea />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 12,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<Textarea />",
            },
          ]
        `);
      },
    },
    {
      template: '<textarea aria-label="first label" aria-labelledby="second label" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 68,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea aria-label=\\"first label\\" aria-labelledby=\\"second label\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<textarea id="label-input" aria-label="second label" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 55,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea id=\\"label-input\\" aria-label=\\"second label\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<label>Textarea label<textarea aria-label="Custom label" /></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "endColumn": 59,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<textarea aria-label=\\"Custom label\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<div><select></select></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select></select>",
            },
          ]
        `);
      },
    },
    {
      template: '<select></select>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select></select>",
            },
          ]
        `);
      },
    },
    {
      template: '<select title="some title value" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select title=\\"some title value\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<label><select></select></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements require a valid associated label.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select></select>",
            },
          ]
        `);
      },
    },
    {
      template: '<select aria-label="first label" aria-labelledby="second label" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select aria-label=\\"first label\\" aria-labelledby=\\"second label\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<select id="label-input" aria-label="second label" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select id=\\"label-input\\" aria-label=\\"second label\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<label>Select label<select aria-label="Custom label" /></label>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 55,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "form elements should not have multiple labels.",
              "rule": "require-input-label",
              "severity": 2,
              "source": "<select aria-label=\\"Custom label\\" />",
            },
          ]
        `);
      },
    },
  ],
});
