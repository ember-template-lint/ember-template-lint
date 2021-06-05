'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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
  ],

  bad: [
    {
      template: '<div role="button"><h2>Test</h2></div>',
      result: {
        message: '<div> has a role of button, it cannot have semantic descendants like <h2>',
        line: 1,
        column: 0,
        source: '<div role="button"><h2>Test</h2></div>',
      },
    },
    {
      template: '<div role="button"><h2 role="presentation"><img /></h2></div>',
      result: {
        message: '<div> has a role of button, it cannot have semantic descendants like <img>',
        line: 1,
        column: 0,
        source: '<div role="button"><h2 role="presentation"><img /></h2></div>',
      },
    },
    {
      template:
        '<div role="button"><h2 role="presentation"><button>Test <img/></button></h2></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<div> has a role of button, it cannot have semantic descendants like <button>",
              "rule": "require-presentational-children",
              "severity": 2,
              "source": "<div role=\\"button\\"><h2 role=\\"presentation\\"><button>Test <img/></button></h2></div>",
            },
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<div> has a role of button, it cannot have semantic descendants like <img>",
              "rule": "require-presentational-children",
              "severity": 2,
              "source": "<div role=\\"button\\"><h2 role=\\"presentation\\"><button>Test <img/></button></h2></div>",
            },
          ]
        `);
      },
    },
  ],
});
