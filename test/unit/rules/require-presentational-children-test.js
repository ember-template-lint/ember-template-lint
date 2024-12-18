import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-presentational-children',

  config: true,

  good: [
    '<button></button>',
    '<div></div>',
    '<li role="tab">Tab title</li>',
    '<li role="tab"><h3 role="presentation">Tab Title</h3></li>',
    '<div role="button"><div><span></span></div></div>',
    '<span role="checkbox"/>',
    '<div role="article"><h2>Hello</h2></div>',
    `
    <ul role="tablist">
      <li role="presentation">
        <a role="tab" href="#">Tab 1</a>
      </li>
    </ul>
    `,
    `<button><img aria-hidden="true" /></button>`,
    `<div role="button"><img aria-hidden="true" /></div>`,
    `<div role="button"><img role="none" /></div>`,
    `
    <svg role="img">
      <title>Title here</title>
      <circle cx="10" cy="10" r="10"></circle>
    </svg>`,
    {
      config: { additionalNonSemanticTags: ['custom-element'] },
      template: `<button><div>item1</div><custom-element>item2</custom-element></button>`,
    },
    {
      config: { additionalNonSemanticTags: ['custom-element'] },
      template: `<div role="button"><div>item1</div><custom-element>item2</custom-element></div>`,
    },
  ],

  bad: [
    {
      template: '<div role="button"><h2>Test</h2></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<div> has a role of button, it cannot have semantic descendants like <h2>",
              "rule": "require-presentational-children",
              "severity": 2,
              "source": "<h2>Test</h2>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="button"><h2 role="presentation"><img /></h2></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 43,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<div> has a role of button, it cannot have semantic descendants like <img>",
              "rule": "require-presentational-children",
              "severity": 2,
              "source": "<img />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="button"><h2 role="presentation"><button>Test <img/></button></h2></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 43,
              "endColumn": 71,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<div> has a role of button, it cannot have semantic descendants like <button>",
              "rule": "require-presentational-children",
              "severity": 2,
              "source": "<button>Test <img/></button>",
            },
            {
              "column": 56,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<div> has a role of button, it cannot have semantic descendants like <img>",
              "rule": "require-presentational-children",
              "severity": 2,
              "source": "<img/>",
            },
          ]
        `);
      },
    },
  ],
});
