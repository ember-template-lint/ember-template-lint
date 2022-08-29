import { ARGLESS_BUILTIN_HELPERS } from '../../../lib/rules/no-implicit-this.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

let statements = [
  (path) => `{{${path}}}`,
  (path) => `{{${path} argument=true}}`,
  (path) => `{{#${path}}}{{/${path}}}`,
  (path) => `{{helper argument=${path}}}`,
  (path) => `{{#helper argument=${path}}}{{/helper}}`,
  (path) => `{{echo (helper ${path})}}`,
  (path) => `<div {{helper ${path}}}></div>`,
];

let builtins = ARGLESS_BUILTIN_HELPERS.reduce((accumulator, helper) => {
  return [...accumulator, `{{${helper}}}`, `{{"inline: " (${helper})}}`];
}, []);

let good = [
  ...builtins,
  '{{welcome-page}}',
  '<WelcomePage />',
  '<MyComponent @prop={{can "edit" @model}} />',
  {
    config: { allow: ['book-details'] },
    template: '{{book-details}}',
  },
  {
    config: { allow: [/^data-test-.+/] },
    template: '{{foo-bar data-test-foo}}',
  },
  {
    template: `import { hbs } from 'ember-cli-htmlbars';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`,
    meta: {
      filePath: 'layout.gjs',
    },
  },
  {
    template: `import { hbs } from 'ember-cli-htmlbars';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`,
    meta: {
      filePath: 'layout.gts',
    },
  },
  {
    config: { isStrictMode: false },
    template: `import { hbs } from 'ember-cli-htmlbars';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`,
    meta: {
      filePath: 'layout.js',
    },
  },
  {
    template: `import { hbs } from 'ember-cli-htmlbars';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`,
    meta: {
      filePath: 'layout.ts',
    },
  },
];

for (const statement of statements) {
  good.push(
    `${statement('@book')}`,
    `${statement('@book.author')}`,
    `${statement('this.book')}`,
    `${statement('this.book.author')}`,
    `{{#books as |book|}}${statement('book')}{{/books}}`,
    `{{#books as |book|}}${statement('book.author')}{{/books}}`
  );
}

generateRuleTests({
  name: 'no-implicit-this',

  config: true,

  good,

  bad: [
    {
      template: '{{book}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'book' is not allowed. Use '@book' if it is a named argument or 'this.book' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book",
            },
          ]
        `);
      },
    },
    {
      template: '{{book-details}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'book-details' is not allowed. Use '@book-details' if it is a named argument or 'this.book-details' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book-details'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book-details",
            },
          ]
        `);
      },
    },
    {
      template: '{{book.author}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'book.author' is not allowed. Use '@book.author' if it is a named argument or 'this.book.author' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book.author'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book.author",
            },
          ]
        `);
      },
    },
    {
      template: '{{helper book}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'book' is not allowed. Use '@book' if it is a named argument or 'this.book' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book",
            },
          ]
        `);
      },
    },
    {
      template: '{{#helper book}}{{/helper}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'book' is not allowed. Use '@book' if it is a named argument or 'this.book' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent @prop={{can.do}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'can.do' is not allowed. Use '@can.do' if it is a named argument or 'this.can.do' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['can.do'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "can.do",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent @prop={{can.do}} />',
      config: { allow: ['can'] },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'can.do' is not allowed. Use '@can.do' if it is a named argument or 'this.can.do' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['can.do'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "can.do",
            },
          ]
        `);
      },
    },
    {
      template: '{{session.user.name}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'session.user.name' is not allowed. Use '@session.user.name' if it is a named argument or 'this.session.user.name' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['session.user.name'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "session.user.name",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent @prop={{session.user.name}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 21,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Ambiguous path 'session.user.name' is not allowed. Use '@session.user.name' if it is a named argument or 'this.session.user.name' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['session.user.name'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "session.user.name",
            },
          ]
        `);
      },
    },
    {
      template: '<template>{{book}}</template>',
      meta: {
        filePath: 'layout.gjs',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.gjs",
              "line": 1,
              "message": "Ambiguous path 'book' is not allowed. Use '@book' if it is a named argument or 'this.book' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book",
            },
          ]
        `);
      },
    },
    {
      meta: {
        filePath: 'layout.gjs',
      },
      template: `import { hbs } from 'ember-template-imports';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 62,
              "endColumn": 66,
              "endLine": 4,
              "filePath": "layout.gjs",
              "line": 4,
              "message": "Ambiguous path 'book' is not allowed. Use '@book' if it is a named argument or 'this.book' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book",
            },
          ]
        `);
      },
    },
    {
      meta: {
        filePath: 'layout.gjs',
      },
      template: `import { hbs as theHbs } from 'ember-template-imports';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(theHbs\`{{book}}\`, templateOnly());`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 65,
              "endColumn": 69,
              "endLine": 4,
              "filePath": "layout.gjs",
              "line": 4,
              "message": "Ambiguous path 'book' is not allowed. Use '@book' if it is a named argument or 'this.book' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['book'] }.",
              "rule": "no-implicit-this",
              "severity": 2,
              "source": "book",
            },
          ]
        `);
      },
    },
  ],
});
