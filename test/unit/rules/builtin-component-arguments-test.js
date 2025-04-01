import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'builtin-component-arguments',

  config: true,

  good: [
    '<Input/>',
    '<input type="text" size="10" />',
    '<Input @type="text" size="10" />',
    '<Input @type="checkbox" @checked={{true}} />',
    '<Textarea @value="Tomster" />',
    // Components from non-Ember locations should not be flagged
    {
      template: 'import { Input } from "my-custom-components";\n\n<template><Input type="text" /></template>',
      meta: { filePath: 'template.gjs' },
    },
    {
      template: 'import { Input } from "my-custom-components";\n\n<template><Input type="text" /></template>',
      meta: { filePath: 'template.gts' },
    },
    {
      template: 'import { Textarea } from "my-custom-components";\n\n<template><Textarea value="world" /></template>',
      meta: { filePath: 'template.gjs' },
    },
    {
      template: 'import { Textarea } from "my-custom-components";\n\n<template><Textarea value="world" /></template>',
      meta: { filePath: 'template.gts' },
    },
  ],

  bad: [
    {
      template: '<Input type="text" size="10" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Setting the \`type\` attribute on the builtin <Input> component is not allowed. Did you mean \`@type\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "type="text"",
            },
          ]
        `);
      },
    },
    {
      template: '<Input @type="checkbox" checked />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 24,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Setting the \`checked\` attribute on the builtin <Input> component is not allowed. Did you mean \`@checked\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "checked",
            },
          ]
        `);
      },
    },
    {
      template: '<Textarea value="Tomster" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Setting the \`value\` attribute on the builtin <Textarea> component is not allowed. Did you mean \`@value\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "value="Tomster"",
            },
          ]
        `);
      },
    },
    // Components with aliases should be flagged with the original name
    {
      template: 'import { Input as CustomInput } from "@ember/component";\n\n<template><CustomInput type="text" /></template>',
      meta: { filePath: 'template.gjs' },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 23,
              "endColumn": 34,
              "endLine": 3,
              "filePath": "template.gjs",
              "line": 3,
              "message": "Setting the \`type\` attribute on the builtin <Input> component is not allowed. Did you mean \`@type\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "type="text"",
            },
          ]
        `);
      },
    },
    {
      template: 'import { Input as CustomInput } from "@ember/component";\n\n<template><CustomInput type="text" /></template>',
      meta: { filePath: 'template.gts' },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 23,
              "endColumn": 34,
              "endLine": 3,
              "filePath": "template.gts",
              "line": 3,
              "message": "Setting the \`type\` attribute on the builtin <Input> component is not allowed. Did you mean \`@type\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "type="text"",
            },
          ]
        `);
      },
    },
    {
      template: 'import { Textarea as CustomTextarea } from "@ember/component";\n\n<template><CustomTextarea value="world" /></template>',
      meta: { filePath: 'template.gjs' },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 26,
              "endColumn": 39,
              "endLine": 3,
              "filePath": "template.gjs",
              "line": 3,
              "message": "Setting the \`value\` attribute on the builtin <Textarea> component is not allowed. Did you mean \`@value\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "value="world"",
            },
          ]
        `);
      },
    },
    {
      template: 'import { Textarea as CustomTextarea } from "@ember/component";\n\n<template><CustomTextarea value="world" /></template>',
      meta: { filePath: 'template.gts' },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 26,
              "endColumn": 39,
              "endLine": 3,
              "filePath": "template.gts",
              "line": 3,
              "message": "Setting the \`value\` attribute on the builtin <Textarea> component is not allowed. Did you mean \`@value\`?",
              "rule": "builtin-component-arguments",
              "severity": 2,
              "source": "value="world"",
            },
          ]
        `);
      },
    },
  ],
});
