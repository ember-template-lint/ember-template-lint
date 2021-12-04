import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-trailing-spaces',

  config: true,

  good: [
    'test',
    'test\n',
    'test\n' + '\n',
    // test the re-entering of yielded content
    '{{#my-component}}\n' + '  test\n' + '{{/my-component}}',
  ],

  bad: [
    {
      template: 'test ',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "test ",
            },
          ]
        `);
      },
    },
    {
      template: 'test \n',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "endColumn": 0,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "test ",
            },
          ]
        `);
      },
    },
    {
      template: 'test\n' + ' \n',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 0,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": " ",
            },
          ]
        `);
      },
    },
    // test the re-entering of yielded content
    // only generates one error instead of two
    {
      template: '{{#my-component}}\n' + '  test \n' + '{{/my-component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 17,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "  test ",
            },
          ]
        `);
      },
    },
  ],
});
