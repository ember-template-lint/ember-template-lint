'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-empty-headings');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-empty-headings',

  config: true,

  good: [
    '<h1>Accessible Heading</h1>',
    '<h1>Accessible&nbsp;Heading</h1>',
    '<h1 aria-hidden="true">Valid Heading</h1>',
    '<h1 aria-hidden="true"><span>Valid Heading</span></h1>',
    '<h1 aria-hidden="false">Accessible Heading</h1>',
    '<h1 hidden>Valid Heading</h1>',
    '<h1 hidden><span>Valid Heading</span></h1>',
    '<h1><span aria-hidden="true">Hidden text</span><span>Visible text</span></h1>',
    '<h1><span aria-hidden="true">Hidden text</span>Visible text</h1>',
    '<div role="heading" aria-level="1">Accessible Text</div>',
    '<div role="heading" aria-level="1"><span>Accessible Text</span></div>',
    '<div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span><span>Visible text</span></div>',
    '<div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span>Visible text</div>',
    '<div></div>',
    '<p></p>',
    '<span></span>',
    '<header></header>',
    '<h2><CustomComponent /></h2>',
    '<h2>{{@title}}</h2>',
    '<h2>{{#component}}{{/component}}</h2>',
    '<h2><span>{{@title}}</span></h2>',
    '<h2><div><CustomComponent /></div></h2>',
    '<h2><div></div><CustomComponent /></h2>',
    '<h2><div><span>{{@title}}</span></div></h2>',
    '<h2><span>Some text{{@title}}</span></h2>',
    '<h2><span><div></div>{{@title}}</span></h2>',
  ],

  bad: [
    {
      template: '<h1></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1> \n &nbsp;</h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1> 
           &nbsp;</h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span></span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span></span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span> \n &nbsp;</span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span> 
           &nbsp;</span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><div><span></span></div></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><div><span></span></div></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span></span><span></span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span></span><span></span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1> &nbsp; <div aria-hidden="true">Some hidden text</div></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1> &nbsp; <div aria-hidden=\\"true\\">Some hidden text</div></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span aria-hidden="true">Inaccessible text</span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span aria-hidden=\\"true\\">Inaccessible text</span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span hidden>Inaccessible text</span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span hidden>Inaccessible text</span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span hidden>{{@title}}</span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span hidden>{{@title}}</span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span hidden>{{#component}}Inaccessible text{{/component}}</span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span hidden>{{#component}}Inaccessible text{{/component}}</span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<h1><span hidden><CustomComponent>Inaccessible text</CustomComponent></span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span hidden><CustomComponent>Inaccessible text</CustomComponent></span></h1>",
            },
          ]
        `);
      },
    },
    {
      template:
        '<h1><span aria-hidden="true">Hidden text</span><span aria-hidden="true">Hidden text</span></h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<h1><span aria-hidden=\\"true\\">Hidden text</span><span aria-hidden=\\"true\\">Hidden text</span></h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="heading" aria-level="1"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<div role=\\"heading\\" aria-level=\\"1\\"></div>",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="heading" aria-level="1"><span aria-hidden="true">Inaccessible text</span></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<div role=\\"heading\\" aria-level=\\"1\\"><span aria-hidden=\\"true\\">Inaccessible text</span></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="heading" aria-level="1"><span hidden>Inaccessible text</span></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.",
              "rule": "no-empty-headings",
              "severity": 2,
              "source": "<div role=\\"heading\\" aria-level=\\"1\\"><span hidden>Inaccessible text</span></div>",
            },
          ]
        `);
      },
    },
  ],
});
