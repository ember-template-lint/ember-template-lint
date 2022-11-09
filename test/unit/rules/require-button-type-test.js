import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-button-type',

  config: true,

  good: [
    // valid static values
    '<button type="button" />',
    '<button type="button">label</button>',
    '<button type="submit" />',
    '<button type="reset" />',
    // dynamic values
    '<button type="{{buttonType}}" />',
    '<button type={{buttonType}} />',
    '<div/>',
    '<div></div>',
    '<div type="randomType"></div>',
  ],

  bad: [
    {
      template: '<button/>',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 9,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button/>",
            },
          ]
        `);
      },
    },
    {
      template: '<button>label</button>',
      fixedTemplate: '<button type="button">label</button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 22,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button>label</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="" />',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button type=\\"\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="foo" />',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button type=\\"foo\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type=42 />',
      fixedTemplate: '<button type="button" />',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button type=42 />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button></button></form>',
      fixedTemplate: '<form><button type="submit"></button></form>',
    },
    {
      template: '/** silly example <button> usage */ <template><button></button></template>',
      meta: {
        filePath: 'layout.gjs',
      },
      fixedTemplate:
        '/** silly example <button> usage */ <template><button type="button"></button></template>',
      skipDisabledTests: true,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 46,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.gjs",
              "isFixable": true,
              "line": 1,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button></button>",
            },
          ]
        `);
      },
    },
    {
      template: `
        import { hbs } from 'ember-template-imports';
        import { setComponentTemplate } from '@ember/component';
        import templateOnly from '@ember/component/template-only';
        /** silly example <button> usage */
        export const SomeComponent = setComponentTemplate(hbs\`<button></button>\`, templateOnly());`,
      meta: {
        filePath: 'layout.js',
      },
      fixedTemplate: `
        import { hbs } from 'ember-template-imports';
        import { setComponentTemplate } from '@ember/component';
        import templateOnly from '@ember/component/template-only';
        /** silly example <button> usage */
        export const SomeComponent = setComponentTemplate(hbs\`<button type="button"></button>\`, templateOnly());`,
      skipDisabledTests: true,

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 62,
              "endColumn": 79,
              "endLine": 6,
              "filePath": "layout.js",
              "isFixable": true,
              "line": 6,
              "message": "All \`<button>\` elements should have a valid \`type\` attribute",
              "rule": "require-button-type",
              "severity": 2,
              "source": "<button></button>",
            },
          ]
        `);
      },
    },
  ],
});
