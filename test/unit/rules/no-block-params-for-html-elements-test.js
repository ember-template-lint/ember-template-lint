'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-block-params-for-html-elements',

  config: true,

  good: [
    '<div></div>',
    '<Checkbox as |blockName|></Checkbox>',
    '<@nav.Link as |blockName|></@nav.Link>',
    '<this.foo as |blah|></this.foo>',
    '{{#let (component \'foo\') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}',
    '<Something><:Item as |foo|></:Item></Something>',
  ],

  bad: [
    {
      template: '<div as |blockName|></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Block parameters on <div> elements are disallowed",
              "rule": "no-block-params-for-html-elements",
              "severity": 2,
              "source": "<div as |blockName|></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div as |a b c|></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Block parameters on <div> elements are disallowed",
              "rule": "no-block-params-for-html-elements",
              "severity": 2,
              "source": "<div as |a b c|></div>",
            },
          ]
        `);
      },
    },
  ],
});
