import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'link-rel-noopener',

  config: true,

  good: [
    '<a href="/some/where"></a>',
    '<a href="/some/where" target="_self"></a>',
    '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
    '<a href="/some/where" target="_blank" rel="noreferrer noopener"></a>',
    '<a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="nofollow noopener noreferrer"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener nofollow noreferrer"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer nofollow"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="nofollow noreferrer noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer nofollow noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a>',
  ],

  bad: [
    {
      template: '<a href="/some/where" target="_blank"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "links with target=\\"_blank\\" must have rel=\\"noopener noreferrer\\"",
              "rule": "link-rel-noopener",
              "severity": 2,
              "source": "<a href=\\"/some/where\\" target=\\"_blank\\"></a>",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
      fixedTemplate:
        '<a href="/some/where" target="_blank" rel="nofollow noopener noreferrer"></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "links with target=\\"_blank\\" must have rel=\\"noopener noreferrer\\"",
              "rule": "link-rel-noopener",
              "severity": 2,
              "source": "<a href=\\"/some/where\\" target=\\"_blank\\" rel=\\"nofollow\\"></a>",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="noopener"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "links with target=\\"_blank\\" must have rel=\\"noopener noreferrer\\"",
              "rule": "link-rel-noopener",
              "severity": 2,
              "source": "<a href=\\"/some/where\\" target=\\"_blank\\" rel=\\"noopener\\"></a>",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
      fixedTemplate: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 59,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "links with target=\\"_blank\\" must have rel=\\"noopener noreferrer\\"",
              "rule": "link-rel-noopener",
              "severity": 2,
              "source": "<a href=\\"/some/where\\" target=\\"_blank\\" rel=\\"noreferrer\\"></a>",
            },
          ]
        `);
      },
    },
  ],
});
