'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

function errMsg(roleName) {
  return `${roleName} is an abstract role, and is not a valid value for the role attribute.`;
}

generateRuleTests({
  name: 'no-abstract-roles',

  config: true,

  good: [
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
  ],

  bad: [
    {
      template: '<img role="command">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "command is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"command\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="composite">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "composite is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"composite\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<input role="input">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "input is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<input role=\\"input\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="landmark">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "landmark is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"landmark\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<input role="range">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "range is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<input role=\\"range\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="roletype">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "roletype is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"roletype\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="section">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "section is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"section\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="sectionhead">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "sectionhead is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"sectionhead\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<select role="select"></select>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "select is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<select role=\\"select\\"></select>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="structure"></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "structure is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<div role=\\"structure\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="widget">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "widget is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"widget\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img role="window">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "window is an abstract role, and is not a valid value for the role attribute.",
              "rule": "no-abstract-roles",
              "severity": 2,
              "source": "<img role=\\"window\\">",
            },
          ]
        `);
      },
    },
  ],
});
