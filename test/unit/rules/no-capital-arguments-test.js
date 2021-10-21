'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-capital-arguments',

  config: true,

  good: ['<Foo @name="bar" />', '@foo'],

  bad: [
    {
      template: '<Foo @Name="bar" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Capital argument names is not supported",
              "rule": "no-capital-arguments",
              "severity": 2,
              "source": "Name",
            },
          ]
        `);
      },
    },
    {
      template: '<Foo @_ame="bar" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Capital argument names is not supported",
              "rule": "no-capital-arguments",
              "severity": 2,
              "source": "_ame",
            },
          ]
        `);
      },
    },
    {
      template: '{{@Name}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Capital argument names is not supported",
              "rule": "no-capital-arguments",
              "severity": 2,
              "source": "Name",
            },
          ]
        `);
      },
    },
    {
      template: '{{@_Name}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "endColumn": 8,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Capital argument names is not supported",
              "rule": "no-capital-arguments",
              "severity": 2,
              "source": "_Name",
            },
          ]
        `);
      },
    },

    ...['@arguments', '@args', '@block', '@else'].map((el) => {
      return {
        template: `{{${el}}}`,
        verifyResults(results) {
          expect(results).toMatchSnapshot();
        },
      };
    }),

    ...['@arguments', '@args', '@block', '@else'].map((el) => {
      return {
        template: `<MyComponent ${el}={{42}} />`,
        verifyResults(results) {
          expect(results).toMatchSnapshot();
        },
      };
    }),
  ],
});
