import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-jsx-attributes',

  config: true,

  good: [
    '<div></div>',
    '<div class="foo"></div>',
    '<div class></div>',
    '<div auto-play></div>',
    '<div content-editable="true"></div>',
  ],
  bad: [
    {
      template: '<div className></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Attribute, className, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.",
              "rule": "no-jsx-attributes",
              "severity": 2,
              "source": "className",
            },
          ]
        `);
      },
    },
    {
      template: '<div className="foo"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Attribute, className, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.",
              "rule": "no-jsx-attributes",
              "severity": 2,
              "source": "className=\\"foo\\"",
            },
          ]
        `);
      },
    },

    {
      template: '<div autoPlay></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Attribute, autoPlay, is probably unintended. Attributes in HTML are kebeb-case. In HTML, all attributes are valid, but 'className' doesn't do anything.",
              "rule": "no-jsx-attributes",
              "severity": 2,
              "source": "autoPlay",
            },
          ]
        `);
      },
    },

    {
      template: '<div contentEditable></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Attribute, contentEditable, is probably unintended. Attributes in HTML are kebeb-case. In HTML, all attributes are valid, but 'className' doesn't do anything.",
              "rule": "no-jsx-attributes",
              "severity": 2,
              "source": "contentEditable",
            },
          ]
        `);
      },
    },
  ],
});
