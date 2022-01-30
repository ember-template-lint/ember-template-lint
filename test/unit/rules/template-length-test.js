import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'template-length',

  config: true,

  good: [
    'testing this\nand\nthis\nand\this',
    {
      config: { max: 10 },
      template: 'testing\nthis\n',
    },
    {
      config: { min: 1 },
      template: 'testing\nthis\nand\this\n',
    },
    {
      config: { min: 1, max: 5 },
      template: 'testing\nthis\nandthis\n',
    },
  ],

  bad: [
    {
      config: { min: 10 },
      template: 'testing\ntoo-short template\n',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 0,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Template length of 3 is smaller than 10",
              "rule": "template-length",
              "severity": 2,
              "source": "testing
          too-short template
          ",
            },
          ]
        `);
      },
    },
    {
      config: { max: 3 },
      template: 'test\nthis\nand\nthis\n',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 0,
              "endLine": 5,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Template length of 5 exceeds 3",
              "rule": "template-length",
              "severity": 2,
              "source": "test
          this
          and
          this
          ",
            },
          ]
        `);
      },
    },
  ],
});
