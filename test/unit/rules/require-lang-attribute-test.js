import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-lang-attribute',

  config: {
    validateValues: false,
  },

  good: ['<html lang="en"></html>', '<html lang="en-US"></html>', '<html lang={{lang}}></html>'],

  bad: [
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
              "message": "The \`<html>\` element must have the \`lang\` attribute with a valid value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html lang=""></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The \`<html>\` element must have the \`lang\` attribute with a valid value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html lang=\\"\\"></html>",
            },
          ]
        `);
      },
    },
  ],
});

generateRuleTests({
  name: 'require-lang-attribute',

  config: {
    validateValues: true,
  },

  good: ['<html lang="en"></html>', '<html lang="en-US"></html>', '<html lang={{lang}}></html>'],

  bad: [
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
              "message": "The \`<html>\` element must have the \`lang\` attribute with a valid value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html lang=""></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The \`<html>\` element must have the \`lang\` attribute with a valid value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html lang=\\"\\"></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html lang="gibberish"></html>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 30,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The \`<html>\` element must have the \`lang\` attribute with a valid value",
              "rule": "require-lang-attribute",
              "severity": 2,
              "source": "<html lang=\\"gibberish\\"></html>",
            },
          ]
        `);
      },
    },
  ],
});
