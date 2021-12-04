import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-heading-inside-button',

  config: true,

  good: [
    '<button>Show More</button>',
    '<button><span>thumbs-up emoji</span>Show More</button>',
    '<button><div>Show More</div></button>',
    '<div>Showing that it is not a button</div>',
    '<div><h1>Page Title in a div is fine</h1></div>',
    '<h1>Page Title</h1>',
  ],

  bad: [
    {
      template: '<button><h1>Page Title</h1></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h1>Page Title</h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><h2>Heading Title</h2></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h2>Heading Title</h2>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><h3>Heading Title</h3></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h3>Heading Title</h3>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><h4>Heading Title</h4></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h4>Heading Title</h4>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><h5>Heading Title</h5></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h5>Heading Title</h5>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><div><h1>Heading Title</h1></div></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h1>Heading Title</h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><h6>Heading Title</h6></button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h6>Heading Title</h6>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="button"><h6>Heading in a div with a role of button</h6></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Buttons should not contain heading elements",
              "rule": "no-heading-inside-button",
              "severity": 2,
              "source": "<h6>Heading in a div with a role of button</h6>",
            },
          ]
        `);
      },
    },
  ],
});
