import os from 'node:os';

import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'linebreak-style',

  config: true,

  good: [
    'testing this',
    'testing \n this',
    'testing \r\n this',
    '<!-- comment \n here -->',
    {
      config: 'system',
      template: os.EOL === '\n' ? 'testing\nthis' : 'testing\r\nthis',
    },
    {
      config: 'windows',
      template: 'testing\r\nthis',
    },
    {
      config: 'unix',
      template: 'testing\nthis',
    },
    {
      meta: {
        editorConfig: { end_of_line: 'crlf' },
      },
      config: 'unix',
      template: 'testing\r\nthis',
    },
  ],

  bad: [
    // {
    //   template: 'something\ngoes\r\n',
    //   fixedTemplate: 'something\ngoes\n',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 4,
    //           "endColumn": 0,
    //           "endLine": 3,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 2,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    // {
    //   config: 'unix',
    //   template: '\r\n',
    //   fixedTemplate: '\n',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 0,
    //           "endColumn": 0,
    //           "endLine": 2,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 1,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    // {
    //   config: 'unix',
    //   template: '{{#if test}}\r\n{{/if}}',
    //   fixedTemplate: '{{#if test}}\n{{/if}}',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 12,
    //           "endColumn": 0,
    //           "endLine": 2,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 1,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    // {
    //   config: 'unix',
    //   template: '{{blah}}\r\n{{blah}}',
    //   fixedTemplate: '{{blah}}\n{{blah}}',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 8,
    //           "endColumn": 0,
    //           "endLine": 2,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 1,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    // {
    //   config: 'unix',
    //   template: '{{blah}}\r\n',
    //   fixedTemplate: '{{blah}}\n',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 8,
    //           "endColumn": 0,
    //           "endLine": 2,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 1,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    // {
    //   config: 'unix',
    //   template: '{{blah arg="\r\n"}}',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 12,
    //           "endColumn": 3,
    //           "endLine": 2,
    //           "filePath": "layout.hbs",
    //           "isFixable": false,
    //           "line": 1,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    // {
    //   config: 'unix',
    //   template: '<blah arg="\r\n" />',
    //   fixedTemplate: '<blah arg="\n" />',

    //   verifyResults(results) {
    //     expect(results).toMatchInlineSnapshot(`
    //       [
    //         {
    //           "column": 11,
    //           "endColumn": 0,
    //           "endLine": 2,
    //           "filePath": "layout.hbs",
    //           "isFixable": true,
    //           "line": 1,
    //           "message": "Wrong linebreak used. Expected LF but found CRLF",
    //           "rule": "linebreak-style",
    //           "severity": 2,
    //           "source": "
    //       ",
    //         },
    //       ]
    //     `);
    //   },
    // },
    {
      config: 'windows',
      template: '1\n2',
      fixedTemplate: '1\r\n2',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 1,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Wrong linebreak used. Expected CRLF but found LF",
              "rule": "linebreak-style",
              "severity": 2,
              "source": "
          ",
            },
          ]
        `);
      },
    },
    {
      config: 'windows',
      template: '<!-- comment\nline -->',
      fixedTemplate: '<!-- comment\r\nline -->',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 8,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Wrong linebreak used. Expected CRLF but found LF",
              "rule": "linebreak-style",
              "severity": 2,
              "source": "
          ",
            },
          ]
        `);
      },
    },
    {
      config: 'unix',
      template: '{{!-- comment\r\nline --}}',
      fixedTemplate: '{{!-- comment\nline --}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 9,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Wrong linebreak used. Expected LF but found CRLF",
              "rule": "linebreak-style",
              "severity": 2,
              "source": "
          ",
            },
          ]
        `);
      },
    },
  ],
});
