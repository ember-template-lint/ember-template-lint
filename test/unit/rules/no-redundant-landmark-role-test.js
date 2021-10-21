'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-redundant-landmark-role',

  config: true,

  good: [
    '<form role="search"></form>',
    '<footer role="contentinfo"></footer>',
    '<footer role={{this.foo}}></footer>',
    '<footer role="{{this.stuff}}{{this.foo}}"></footer>',
  ],

  bad: [
    {
      template: '<header role="banner"></header>',
      fixedTemplate: '<header></header>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<header role=\\"banner\\"></header>",
            },
          ]
        `);
      },
    },
    {
      template: '<main role="main"></main>',
      fixedTemplate: '<main></main>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<main role=\\"main\\"></main>",
            },
          ]
        `);
      },
    },
    {
      template: '<aside role="complementary"></aside>',
      fixedTemplate: '<aside></aside>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<aside role=\\"complementary\\"></aside>",
            },
          ]
        `);
      },
    },
    {
      template: '<nav role="navigation"></nav>',
      fixedTemplate: '<nav></nav>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: navigation on <nav> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<nav role=\\"navigation\\"></nav>",
            },
          ]
        `);
      },
    },
    {
      template: '<form role="form"></form>',
      fixedTemplate: '<form></form>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: form on <form> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<form role=\\"form\\"></form>",
            },
          ]
        `);
      },
    },
    {
      template: '<header role="banner" class="page-header"></header>',
      fixedTemplate: '<header class="page-header"></header>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<header role=\\"banner\\" class=\\"page-header\\"></header>",
            },
          ]
        `);
      },
    },
    {
      template: '<nav role="navigation" class="crumbs" id="id-nav-00"></nav>',
      fixedTemplate: '<nav class="crumbs" id="id-nav-00"></nav>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use of redundant or invalid role: navigation on <nav> detected. If a landmark element is used, any role provided will either be redundant or incorrect.",
              "rule": "no-redundant-landmark-role",
              "severity": 2,
              "source": "<nav role=\\"navigation\\" class=\\"crumbs\\" id=\\"id-nav-00\\"></nav>",
            },
          ]
        `);
      },
    },
  ],
});
