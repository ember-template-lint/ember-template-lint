import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-quoteless-attributes',

  config: true,

  good: [
    '<div data-foo="derp"></div>',
    '<div data-foo="derp {{stuff}}"></div>',
    '<div data-foo={{someValue}}></div>',
    '<div data-foo={{true}}></div>',
    '<div data-foo={{false}}></div>',
    '<div data-foo={{5}}></div>',
    '<SomeThing ...attributes />',
    '<div></div>',
    '<input disabled>',
  ],

  bad: [
    {
      template: '<div data-foo=asdf></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Attribute data-foo should be either quoted or wrapped in mustaches",
              "rule": "no-quoteless-attributes",
              "severity": 2,
              "source": "<div data-foo=asdf></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<SomeThing @blah=asdf />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Argument @blah should be either quoted or wrapped in mustaches",
              "rule": "no-quoteless-attributes",
              "severity": 2,
              "source": "<SomeThing @blah=asdf />",
            },
          ]
        `);
      },
    },
  ],
});
