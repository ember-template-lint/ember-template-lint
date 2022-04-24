import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-forbidden-elements',

  config: true,

  good: [
    '<header></header>',
    '<div></div>',
    '<footer></footer>',
    '<p></p>',
    '<head><meta charset="utf-8"></head>',
    {
      template: '<script></script>',
      config: ['html', 'meta', 'style'],
    },
    {
      template: '<meta>',
      meta: {
        filePath: 'app/templates/head.hbs',
      },
    },
  ],
  bad: [
    {
      template: '<script></script>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <script> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<script></script>",
            },
          ]
        `);
      },
    },
    {
      template: '<html></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <html> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<html></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<style></style>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <style> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<style></style>",
            },
          ]
        `);
      },
    },
    {
      template: '<meta charset="utf-8">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <meta> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<meta charset=\\"utf-8\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<div></div>',
      config: {
        forbidden: ['div'],
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 11,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <div> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<div></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div></div>',
      config: ['div'],
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 11,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <div> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<div></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo />',
      config: ['Foo'],
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <Foo> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<Foo />",
            },
          ]
        `);
      },
    },
    {
      template: '<script></script>',
      meta: {
        filePath: 'app/templates/head.hbs',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "app/templates/head.hbs",
              "line": 1,
              "message": "Use of <script> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<script></script>",
            },
          ]
        `);
      },
    },
    {
      template: '<html></html>',
      meta: {
        filePath: 'app/templates/head.hbs',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "app/templates/head.hbs",
              "line": 1,
              "message": "Use of <html> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<html></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<head><html></html></head>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Use of <html> detected. Do not use forbidden elements.",
              "rule": "no-forbidden-elements",
              "severity": 2,
              "source": "<html></html>",
            },
          ]
        `);
      },
    },
  ],
});
