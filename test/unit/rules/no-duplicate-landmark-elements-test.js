import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-duplicate-landmark-elements',

  config: true,

  good: [
    '<nav aria-label="primary site navigation"></nav><nav aria-label="secondary site navigation within home page"></nav>',
    '<nav aria-label="primary site navigation"></nav><div role="navigation" aria-label="secondary site navigation within home page"></div>',
    '<nav aria-label={{siteNavigation}}></nav><nav aria-label={{siteNavigation}}></nav>',
    // since we can't confirm what the role of the div is, we have to let it pass
    '<nav aria-label="primary site navigation"></nav><div role={{role}} aria-label="secondary site navigation within home page"></div>',
    '<form aria-labelledby="form-title"><div id="form-title">Shipping Address</div></form><form aria-label="meaningful title of second form"></form>',
    '<form role="search"></form><form></form>',
    '<header></header><main></main><footer></footer>',
    '<nav aria-label="primary navigation"></nav><nav aria-label={{this.something}}></nav>',
    '<img role="none"><img role="none">',
  ],

  bad: [
    {
      template: '<nav></nav><nav></nav>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<nav></nav>",
            },
          ]
        `);
      },
    },
    {
      template: '<nav></nav><div role="navigation"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 40,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<div role=\\"navigation\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<nav></nav><nav aria-label="secondary navigation"></nav>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 11,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<nav></nav>",
            },
          ]
        `);
      },
    },
    {
      template: '<main></main><div role="main"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<div role=\\"main\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 40,
              "endColumn": 80,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<nav aria-label=\\"site navigation\\"></nav>",
            },
          ]
        `);
      },
    },
    {
      template: '<form aria-label="search-form"></form><form aria-label="search-form"></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 38,
              "endColumn": 76,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<form aria-label=\\"search-form\\"></form>",
            },
          ]
        `);
      },
    },
    {
      template:
        '<form aria-labelledby="form-title"></form><form aria-labelledby="form-title"></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 42,
              "endColumn": 84,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.",
              "rule": "no-duplicate-landmark-elements",
              "severity": 2,
              "source": "<form aria-labelledby=\\"form-title\\"></form>",
            },
          ]
        `);
      },
    },
  ],
});
