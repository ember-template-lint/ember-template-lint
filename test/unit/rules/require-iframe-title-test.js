import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-iframe-title',

  config: true,

  good: [
    '<iframe title="Welcome to the Matrix!" />',
    '<iframe title={{someValue}} />',
    '<iframe title="" aria-hidden />',
    '<iframe title="" hidden />',
    '<iframe title="foo" /><iframe title="bar" />',
  ],

  bad: [
    {
      template: '<iframe title="foo" /><iframe title="foo" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "This title is not unique. #1",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "title=\\"foo\\"",
            },
            {
              "column": 22,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property. Value title=\\"foo\\" already used for different iframe. #1",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe title=\\"foo\\" />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<iframe title="foo" /><iframe title="boo" /><iframe title="foo" /><iframe title="boo" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "This title is not unique. #1",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "title=\\"foo\\"",
            },
            {
              "column": 44,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property. Value title=\\"foo\\" already used for different iframe. #1",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe title=\\"foo\\" />",
            },
            {
              "column": 30,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "This title is not unique. #2",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "title=\\"boo\\"",
            },
            {
              "column": 66,
              "endColumn": 88,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property. Value title=\\"boo\\" already used for different iframe. #2",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe title=\\"boo\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<iframe src="12" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property.",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe src=\\"12\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<iframe src="12" title={{false}} />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property.",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe src=\\"12\\" title={{false}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<iframe src="12" title="{{false}}" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property.",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe src=\\"12\\" title=\\"{{false}}\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<iframe src="12" title="" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "<iframe> elements must have a unique title property.",
              "rule": "require-iframe-title",
              "severity": 2,
              "source": "<iframe src=\\"12\\" title=\\"\\" />",
            },
          ]
        `);
      },
    },
  ],
});
