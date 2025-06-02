import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-lang-attribute',

  config: true,
  good: [
    '<html lang="en"></html>',
    '<html lang="en-US"></html>',
    '<html lang="DE-BW"></html>',
    '<html lang={{lang}}></html>',
    {
      config: {
        validateValues: true,
      },
      template: '<html lang="de"></html>',
    },
    {
      config: {
        validateValues: true,
      },
      template: '<html lang={{this.language}}></html>',
    },
    {
      config: {
        validateValues: false,
      },
      template: '<html lang="hurrah"></html>',
    },
    {
      config: {
        validateValues: false,
      },
      template: '<html lang={{this.blah}}></html>',
    },
  ],

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
              "source": "<html lang=""></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html></html>',
      config: {
        validateValues: true,
      },
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
      config: {
        validateValues: true,
      },
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
              "source": "<html lang=""></html>",
            },
          ]
        `);
      },
    },
    {
      // no config, allows validateValues to default to true
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
              "source": "<html lang="gibberish"></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html lang="gibberish"></html>',
      config: {
        validateValues: true,
      },
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
              "source": "<html lang="gibberish"></html>",
            },
          ]
        `);
      },
    },
    {
      template: '<html></html>',
      config: {
        validateValues: false,
      },
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
      config: {
        validateValues: false,
      },
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
              "source": "<html lang=""></html>",
            },
          ]
        `);
      },
    },
  ],
});
