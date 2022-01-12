import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-html-comments',

  config: true,

  good: [
    '{{!-- comment here --}}',
    '{{!--comment here--}}',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
    '{{! template-lint-disable no-html-comments }}<!-- lol -->',
  ],

  bad: [
    {
      template: '<!-- comment here -->',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{! comment here }}",
              },
              "line": 1,
              "message": "HTML comment detected",
              "rule": "no-html-comments",
              "severity": 2,
              "source": "<!-- comment here -->",
            },
          ]
        `);
      },
    },
    {
      template: '<!--comment here-->',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{!comment here}}",
              },
              "line": 1,
              "message": "HTML comment detected",
              "rule": "no-html-comments",
              "severity": 2,
              "source": "<!--comment here-->",
            },
          ]
        `);
      },
    },
  ],
});
