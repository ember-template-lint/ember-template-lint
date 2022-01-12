import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-input-tagname',

  config: true,

  good: [
    '{{input type="text"}}',
    '{{component "input" type="text"}}',
    '{{yield (component "input" type="text")}}',
  ],

  bad: [
    {
      template: '{{input tagName="foo"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected \`tagName\` usage on {{input}} helper.",
              "rule": "no-input-tagname",
              "severity": 2,
              "source": "{{input tagName=\\"foo\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{input tagName=bar}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected \`tagName\` usage on {{input}} helper.",
              "rule": "no-input-tagname",
              "severity": 2,
              "source": "{{input tagName=bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{component "input" tagName="foo"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected \`tagName\` usage on {{input}} helper.",
              "rule": "no-input-tagname",
              "severity": 2,
              "source": "{{component \\"input\\" tagName=\\"foo\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{component "input" tagName=bar}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected \`tagName\` usage on {{input}} helper.",
              "rule": "no-input-tagname",
              "severity": 2,
              "source": "{{component \\"input\\" tagName=bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (component "input" tagName="foo")}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected \`tagName\` usage on {{input}} helper.",
              "rule": "no-input-tagname",
              "severity": 2,
              "source": "(component \\"input\\" tagName=\\"foo\\")",
            },
          ]
        `);
      },
    },
    {
      template: '{{yield (component "input" tagName=bar)}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected \`tagName\` usage on {{input}} helper.",
              "rule": "no-input-tagname",
              "severity": 2,
              "source": "(component \\"input\\" tagName=bar)",
            },
          ]
        `);
      },
    },
  ],
});
