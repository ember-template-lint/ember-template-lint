import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'quotes',

  good: [
    // string config
    {
      config: 'double',
      template: '{{component "test"}}',
    },
    {
      config: 'double',
      template: '{{hello x="test"}}',
    },
    {
      config: 'double',
      template: '<input type="checkbox">',
    },
    {
      config: 'single',
      template: "{{component 'test'}}",
    },
    {
      config: 'single',
      template: "{{hello x='test'}}",
    },
    {
      config: 'single',
      template: "<input type='checkbox'>",
    },

    // object config
    {
      config: { curlies: false, html: false },
      template: `{{component "test"}} {{hello x='test'}} <input type='checkbox'> <input type="checkbox">`,
    },
    {
      config: { curlies: false, html: 'single' },
      template: `{{component "test"}} {{hello x='test'}} <input type='checkbox'>`,
    },
    {
      config: { curlies: 'double', html: false },
      template: `{{component "test"}} <input type='checkbox'> <input type="checkbox">`,
    },
    {
      config: { curlies: 'single', html: 'double' },
      template: `<input type="checkbox"> {{hello 'test' x='test'}}`,
    },
    {
      config: { curlies: 'double', html: 'single' },
      template: `<input type='checkbox'> {{hello "test" x="test"}}`,
    },
  ],

  bad: [
    {
      config: 'double',
      template: "{{component 'one {{thing}} two'}}",
      fixedTemplate: '{{component "one {{thing}} two"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{component 'one {{thing}} two'}}",
            },
          ]
        `);
      },
    },
    {
      config: 'double',
      template: "{{component 'test'}}",
      fixedTemplate: '{{component "test"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{component 'test'}}",
            },
          ]
        `);
      },
    },
    {
      config: 'double',
      template: "{{hello x='test'}}",
      fixedTemplate: '{{hello x="test"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "x='test'",
            },
          ]
        `);
      },
    },
    {
      config: 'double',
      template: "<input type='checkbox'>",
      fixedTemplate: '<input type="checkbox">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "type='checkbox'",
            },
          ]
        `);
      },
    },
    {
      config: 'single',
      template: '{{component "test"}}',
      fixedTemplate: "{{component 'test'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{component \\"test\\"}}",
            },
          ]
        `);
      },
    },
    {
      config: 'single',
      template: '{{hello x="test"}}',
      fixedTemplate: "{{hello x='test'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "x=\\"test\\"",
            },
          ]
        `);
      },
    },
    {
      config: 'single',
      template: '<input type="checkbox">',
      fixedTemplate: "<input type='checkbox'>",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "type=\\"checkbox\\"",
            },
          ]
        `);
      },
    },
    {
      // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
      config: 'single',
      template: `<img alt="Abdul's house">`,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "alt=\\"Abdul's house\\"",
            },
          ]
        `);
      },
    },
    {
      // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
      config: 'double',
      template: `<img class='a "so-called" btn {{this.otherClass}}'>`,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use double quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "class='a \\"so-called\\" btn {{this.otherClass}}'",
            },
          ]
        `);
      },
    },
    {
      // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
      config: 'single',
      template: `{{helper "Priya's house"}}`,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "you must use single quotes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{helper \\"Priya's house\\"}}",
            },
          ]
        `);
      },
    },
    {
      config: { curlies: 'double', html: 'single' },
      template: `<input type="checkbox"> {{hello 'test' x='test'}}`,
      fixedTemplate: `<input type='checkbox'> {{hello "test" x="test"}}`,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes for Handlebars syntax and single quotes for HTML attributes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "type=\\"checkbox\\"",
            },
            {
              "column": 32,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes for Handlebars syntax and single quotes for HTML attributes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{hello 'test' x='test'}}",
            },
            {
              "column": 41,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes for Handlebars syntax and single quotes for HTML attributes in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "x='test'",
            },
          ]
        `);
      },
    },
    {
      config: { curlies: 'single', html: 'double' },
      template: `<input type='checkbox'> {{hello "test" x="test"}}`,
      fixedTemplate: `<input type="checkbox"> {{hello 'test' x='test'}}`,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes for HTML attributes and single quotes for Handlebars syntax in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "type='checkbox'",
            },
            {
              "column": 32,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes for HTML attributes and single quotes for Handlebars syntax in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "{{hello \\"test\\" x=\\"test\\"}}",
            },
            {
              "column": 41,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "you must use double quotes for HTML attributes and single quotes for Handlebars syntax in templates",
              "rule": "quotes",
              "severity": 2,
              "source": "x=\\"test\\"",
            },
          ]
        `);
      },
    },
  ],

  error: [
    {
      config: 'sometimes',
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `"sometimes"`',
      },
    },
    {
      config: true,
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `true`',
      },
    },
    {
      config: { curlies: 'double', html: 'sometimes' },
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{"curlies":"double","html":"sometimes"}`',
      },
    },
    {
      config: { curlies: 'double' },
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{"curlies":"double"}`',
      },
    },
    {
      config: { html: 'sometimes' },
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{"html":"sometimes"}`',
      },
    },
    {
      config: { curlies: 'double', html: 'single', other: 'foobar' },
      template: 'test',

      result: {
        fatal: true,
        message: 'You specified `{"curlies":"double","html":"single","other":"foobar"}`',
      },
    },
  ],
});
