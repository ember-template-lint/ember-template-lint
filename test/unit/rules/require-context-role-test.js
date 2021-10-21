'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const { errorMessage } = require('./../../../lib/rules/require-context-role');

generateRuleTests({
  name: 'require-context-role',

  config: true,

  good: [
    '<div role="list"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div>',
    '<div role="group"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div>',
    '<div role="row"><div role="columnheader">Item One</div></div>',
    '<div role="gridcell">Item One</div>',
    '<div role="row">{{yield}}</div>',
    '<div role="row"><div role="gridcell">Item One</div></div>',
    '<div role="row"><br>{{#if a}}<div role="gridcell">Item One</div>{{/if}}</div>',
    '<div role="group"><div role="menuitem">Item One</div></div>',
    '<div role="menu"><div role="menuitem">Item One</div></div>',
    '<div role="menubar"><div role="menuitem">Item One</div></div>',
    '<div role="menu"><div role="menuitemcheckbox">Item One</div></div>',
    '<div role="menubar"><div role="menuitemcheckbox">Item One</div></div>',
    '<div role="group"><div role="menuitemradio">Item One</div></div>',
    '<div role="menu"><div role="menuitemradio">Item One</div></div>',
    '<div role="menubar"><div role="menuitemradio">Item One</div></div>',
    '<div role="listbox"><div role="option">Item One</div></div>',
    '<div role="grid"><div role="row">Item One</div></div>',
    '<div role="rowgroup"><div role="row">Item One</div></div>',
    '<div role="treegrid"><div role="row">Item One</div></div>',
    '<div aria-hidden="true" role="tablist"><div role="treeitem">Item One</div></div>',
    '<div role="grid"><div role="rowgroup">Item One</div></div>',
    '<div role="row"><div role="rowheader">Item One</div></div>',
    '<div role="tablist"><div role="tab">Item One</div></div>',
    '<div role="group"><div role="treeitem">Item One</div></div>',
    '<div role="tree"><div role="treeitem">Item One</div></div>',
    '<div role="list">{{#each someList as |item|}}{{list-item item=item}}{{/each}}</div>',
    '<div role="list">{{#each someList as |item|}}<ListItem @item={{item}} />{{/each}}</div>',
    '<div role="list">{{#if this.show}}{{#each someList as |item|}}<ListItem @item={{item}} />{{/each}}{{/if}}</div>',
  ],

  bad: [
    {
      template: '<div role="tablist"><div role="treeitem">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 25,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"treeitem\\" but it is missing the required (immediate) parent element of \\"[group, tree]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#treeitem.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"treeitem\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="columnheader">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"columnheader\\" but it is missing the required (immediate) parent element of \\"[row]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#columnheader.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"columnheader\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="gridcell">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"gridcell\\" but it is missing the required (immediate) parent element of \\"[row]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#gridcell.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"gridcell\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="listitem">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"listitem\\" but it is missing the required (immediate) parent element of \\"[group, list]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#listitem.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"listitem\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="menuitem">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"menuitem\\" but it is missing the required (immediate) parent element of \\"[group, menu, menubar]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#menuitem.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"menuitem\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="menuitemcheckbox">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"menuitemcheckbox\\" but it is missing the required (immediate) parent element of \\"[menu, menubar]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#menuitemcheckbox.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"menuitemcheckbox\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="menuitemradio">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"menuitemradio\\" but it is missing the required (immediate) parent element of \\"[group, menu, menubar]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#menuitemradio.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"menuitemradio\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="option">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"option\\" but it is missing the required (immediate) parent element of \\"[listbox]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#option.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"option\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="row">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"row\\" but it is missing the required (immediate) parent element of \\"[grid, rowgroup, treegrid]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#row.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"row\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="rowgroup">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"rowgroup\\" but it is missing the required (immediate) parent element of \\"[grid]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#rowgroup.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"rowgroup\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="rowheader">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"rowheader\\" but it is missing the required (immediate) parent element of \\"[row]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#rowheader.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"rowheader\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="tab">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"tab\\" but it is missing the required (immediate) parent element of \\"[tablist]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#tab.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"tab\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div role="treeitem">Item One</div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 10,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "You have an element with the role of \\"treeitem\\" but it is missing the required (immediate) parent element of \\"[group, tree]\\". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#treeitem.",
              "rule": "require-context-role",
              "severity": 2,
              "source": "role=\\"treeitem\\"",
            },
          ]
        `);
      },
    },
  ],
});
