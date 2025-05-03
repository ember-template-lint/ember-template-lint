import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-jsx-attributes',

  config: true,

  good: [
    '<div></div>',
    '<div class="foo"></div>',
    '<div class></div>',
    '<div autoplay></div>',
    '<div contenteditable="true"></div>',
  ],
  bad: [
    {
      template: '<div acceptCharset="utf-8"></div>',
      fixedTemplate: '<div accept-charset="utf-8"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 26,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect html attribute name detected - "acceptCharset", is probably unintended. Attributes in HTML are kebeb case.",
              "rule": "no-jsx-attributes",
              "severity": 2,
              "source": "acceptCharset="utf-8"",
            },
          ]
            `);
      },
    },
    {
      template: '<div contentEditable="true"></div>',
      fixedTemplate: '<div contenteditable="true"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
        [
          {
            "column": 5,
            "endColumn": 27,
            "endLine": 1,
            "filePath": "layout.hbs",
            "isFixable": true,
            "line": 1,
            "message": "Incorrect html attribute name detected - "contentEditable", is probably unintended. Attributes in HTML are kebeb case.",
            "rule": "no-jsx-attributes",
            "severity": 2,
            "source": "contentEditable="true"",
          },
        ]
          `);
      },
    },
    {
      template: '<div className></div>',
      fixedTemplate: '<div class></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
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
      fixedTemplate: '<div class="foo"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Attribute, className, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.",
              "rule": "no-jsx-attributes",
              "severity": 2,
              "source": "className="foo"",
            },
          ]
        `);
      },
    },

    {
      template: '<div autoPlay></div>',
      fixedTemplate: '<div autoplay></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect html attribute name detected - "autoPlay", is probably unintended. Attributes in HTML are kebeb case.",
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
      fixedTemplate: '<div contenteditable></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect html attribute name detected - "contentEditable", is probably unintended. Attributes in HTML are kebeb case.",
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
