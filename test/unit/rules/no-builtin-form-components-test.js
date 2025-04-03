import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-builtin-form-components',

  config: true,

  good: [
    '<input type="text" />',
    '<input type="checkbox" />',
    '<input type="radio" />',
    '<textarea></textarea>',
    // Strict mode templates with native elements
    {
      template: '<template><input type="text" /></template>',
      meta: { filePath: 'template.gjs' },
    },
    {
      template: '<template><input type="text" /></template>',
      meta: { filePath: 'template.gts' },
    },
    {
      template: '<template><textarea></textarea></template>',
      meta: { filePath: 'template.gjs' },
    },
    {
      template: '<template><textarea></textarea></template>',
      meta: { filePath: 'template.gts' },
    },
    // Components with same name from different locations should not be flagged
    {
      template: 'import { Input } from "my-custom-components";\n\n<template><Input /></template>',
      meta: { filePath: 'template.gjs' },
    },
    {
      template: 'import { Input } from "my-custom-components";\n\n<template><Input /></template>',
      meta: { filePath: 'template.gts' },
    },
    {
      template:
        'import { Textarea } from "my-custom-components";\n\n<template><Textarea></Textarea></template>',
      meta: { filePath: 'template.gjs' },
    },
    {
      template:
        'import { Textarea } from "my-custom-components";\n\n<template><Textarea></Textarea></template>',
      meta: { filePath: 'template.gts' },
    },
  ],

  bad: [
    {
      template: '<Input />',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(`
          {
            "results": [
              {
                "column": 0,
                "endColumn": 9,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`Input\` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.",
                "rule": "no-builtin-form-components",
                "severity": 2,
                "source": "<Input />",
              },
            ],
          }
        `);
      },
    },
    {
      template: '<Textarea></Textarea>',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(`
          {
            "results": [
              {
                "column": 0,
                "endColumn": 21,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`Textarea\` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.",
                "rule": "no-builtin-form-components",
                "severity": 2,
                "source": "<Textarea></Textarea>",
              },
            ],
          }
        `);
      },
    },
    // Strict mode templates with built-in components
    {
      template: 'import { Input } from "@ember/component";\n\n<template><Input /></template>',
      meta: { filePath: 'template.gjs' },
      verifyResults(results) {
        expect(results).toHaveLength(1);
        expect(results[0].message).toBe(
          'Do not use the `Input` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.'
        );
      },
    },
    {
      template:
        'import { Input as BuiltInInput } from "@ember/component";\n\n<template><BuiltInInput /></template>',
      meta: { filePath: 'template.gjs' },
      verifyResults(results) {
        expect(results).toHaveLength(1);
        expect(results[0].message).toBe(
          'Do not use the `Input` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.'
        );
      },
    },
    {
      template: 'import { Input } from "@ember/component";\n\n<template><Input /></template>',
      meta: { filePath: 'template.gts' },
      verifyResults(results) {
        expect(results).toHaveLength(1);
        expect(results[0].message).toBe(
          'Do not use the `Input` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.'
        );
      },
    },
    {
      template:
        'import { Textarea } from "@ember/component";\n\n<template><Textarea></Textarea></template>',
      meta: { filePath: 'template.gjs' },
      verifyResults(results) {
        expect(results).toHaveLength(1);
        expect(results[0].message).toBe(
          'Do not use the `Textarea` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.'
        );
      },
    },
    {
      template:
        'import { Textarea } from "@ember/component";\n\n<template><Textarea></Textarea></template>',
      meta: { filePath: 'template.gts' },
      verifyResults(results) {
        expect(results).toHaveLength(1);
        expect(results[0].message).toBe(
          'Do not use the `Textarea` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.'
        );
      },
    },
  ],
});
