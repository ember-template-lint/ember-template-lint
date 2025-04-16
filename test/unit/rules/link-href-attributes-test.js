import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'link-href-attributes',

  config: true,

  good: [
    '<a href=""></a>' /* empty string is really valid! */,
    '<a href="#"></a>',
    '<a href="javascript:;"></a>',
    '<a href="http://localhost"></a>',
    '<a href={{link}}></a>',
    '<a role="link" aria-disabled="true">valid</a>',
  ],

  bad: [
    {
      template: '<a></a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "a tags must have an href attribute",
              "rule": "link-href-attributes",
              "severity": 2,
              "source": "<a></a>",
            },
          ]
        `);
      },
    },
  ],
});
