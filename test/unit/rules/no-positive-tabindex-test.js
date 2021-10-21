'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-positive-tabindex',

  config: true,

  good: [
    '<button tabindex="0"></button>',
    '<button tabindex="-1"></button>',
    '<button tabindex={{-1}}>baz</button>',
    '<button tabindex={{"-1"}}>baz</button>',
    '<button tabindex="{{-1}}">baz</button>',
    '<button tabindex="{{"-1"}}">baz</button>',
    '<button tabindex="{{if this.show -1}}">baz</button>',
    '<button tabindex="{{if this.show "-1" "0"}}">baz</button>',
    '<button tabindex="{{if (not this.show) "-1" "0"}}">baz</button>',
    '<button tabindex={{if this.show -1}}>baz</button>',
    '<button tabindex={{if this.show "-1" "0"}}>baz</button>',
    '<button tabindex={{if (not this.show) "-1" "0"}}>baz</button>',
  ],

  bad: [
    {
      template: '<button tabindex={{someProperty}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tabindex values must be negative numeric.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex={{someProperty}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="1"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"1\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="text"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tabindex values must be negative numeric.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"text\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex={{true}}></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tabindex values must be negative numeric.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex={{true}}",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{false}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tabindex values must be negative numeric.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{false}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{5}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{5}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{if a 1 -1}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{if a 1 -1}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{if a -1 1}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{if a -1 1}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{if a 1}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{if a 1}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{if (not a) 1}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{if (not a) 1}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{unless a 1}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{unless a 1}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<button tabindex="{{unless a -1 1}}"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid positive integer values for tabindex.",
              "rule": "no-positive-tabindex",
              "severity": 2,
              "source": "tabindex=\\"{{unless a -1 1}}\\"",
            },
          ]
        `);
      },
    },
  ],
});
