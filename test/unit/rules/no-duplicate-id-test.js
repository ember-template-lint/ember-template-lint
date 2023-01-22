import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-duplicate-id',

  config: true,

  good: [
    // Unique sibling TextNode IDs
    '<div id="id-00"></div><div id="id-01"></div>',
    '<div id={{unique-id}}></div><div id={{unique-id}}></div>',

    // Built-in helpers:
    '<div id="{{unique-id}}"></div><div id="{{unique-id}}"></div>',
    "<div id='{{unique-id}}'></div><div id='{{unique-id}}'></div>",

    // Mustache Statements
    '<div id={{"id-00"}}></div>',
    '<div id={{this.divId00}}></div>',
    '<div id={{this.divId00}}></div><div id={{this.divId01}}></div>',

    // ConcatStatements
    '<div id="concat-{{this.divId}}"></div>',
    '<div id="concat-{{this.divId00}}"></div><div id="concat-{{this.divId01}}"></div>',

    // Mustache and Concat do not conflict/flag with TextNode
    '<div id={{id-00}}></div><div id="id-00"></div>',
    '<div id="id-00"></div><div id={{id-00}}></div>',
    '<div id="concat-{{id-00}}"></div><div id="concat-id-00"></div>',
    '<div id="concat-id-00"></div><div id="concat-{{id-00}}"></div>',

    // BlockStatement
    '<div id="id-00"></div>{{#foo elementId="id-01"}}{{/foo}}',
    '{{#foo elementId="id-01"}}{{/foo}}<div id="id-00"></div>',
    '{{#if}}<div id="id-00"></div>{{else}}<span id="id-00"></span>{{/if}}',

    // Number
    '<div id={{1234}}></div>',
    '<div id={{1234}}></div><div id={{"1234"}}></div>',

    // Dynamic
    '<div id={{"id-00"}}></div><div id={{"id-01"}}></div>',
    '<div id={{this.foo}}></div><div id={{this.bar}}></div>',

    // Source: Mustache
    '{{foo id="id-00"}}{{foo id="id-01"}}',

    // Mixed
    '<div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{"partB"}}partC"></div>',

    // Bypass: *all* duplicate ids are contained within a control flow helper BlockStatement
    `
      {{#if this.foo}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/if}}
    `,
    `
      {{#if this.foo}}
        <div id="id-00"></div>
      {{else if this.bar}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/if}}
    `,
    `
      {{#unless this.foo}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/unless}}
    `,
    `
      {{#unless this.foo}}
        <div id="id-00"></div>
      {{else unless this.bar}}
        <div id="id-00"></div>
      {{else if this.baz}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/unless}}
    `,
    `
      {{#let blah.id as |footerId|}}
        {{#if this.foo}}
          <div id={{footerId}}></div>
        {{else}}
          <span id={{footerId}}></span>
        {{/if}}
      {{/let}}
    `,
    `
      {{#let 'foobar' as |footerId|}}
        {{#if this.foo}}
          <div id={{footerId}}></div>
        {{else}}
          <span id={{footerId}}></span>
        {{/if}}
      {{/let}}
    `,
    `
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
      {{else}}
        <div id={{this.divId00}}></div>
      {{/if}}
    `,
    {
      template: `
      {{#if this.foo}}
        <div id="partA{{partB}}{{"partC"}}"></div>
      {{else}}
        <div id="partA{{partB}}{{"partC"}}"></div>
      {{/if}}
    `,
    },
    `
      {{#if this.foo}}
        {{#if this.other}}
          <div id="nested"></div>
        {{else}}
          <div id="nested"></div>
        {{/if}}
        <div id="root"></div>
      {{else}}
        <div id="nested"></div>
      {{/if}}
    `,
    `
      <MyComponent as |inputProperties|>
        <Input id={{inputProperties.id}} />
        <div id={{inputProperties.abc}} />
      </MyComponent>

      <MyComponent as |inputProperties|>
        <Input id={{inputProperties.id}} />
      </MyComponent>
    `,
  ],

  bad: [
    {
      template: '<div id="id-00"></div><div id="id-00"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 37,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div><div id="id-01"></div></div><div><div id="id-01"></div></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 43,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-01\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div id="id-00"></div><div id={{"id-00"}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{\\"id-00\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div id={{"id-00"}}></div><div id="id-00"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 31,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div id="id-00"></div><div id="id-{{"00"}}"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-{{\\"00\\"}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div id="id-00"></div><div id="{{"id"}}-00"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"{{\\"id\\"}}-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div id="id-00"></div>{{#foo elementId="id-00"}}{{/foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 22,
              "endColumn": 56,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{#foo elementId=\\"id-00\\"}}{{/foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-00"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 39,
              "endColumn": 49,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div id={{"id-00"}}></div>{{#foo elementId="id-00"}}{{/foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 26,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{#foo elementId=\\"id-00\\"}}{{/foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id={{"id-00"}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 39,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{\\"id-00\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div id="id-{{"00"}}"></div>{{#foo elementId="id-00"}}{{/foo}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 28,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{#foo elementId=\\"id-00\\"}}{{/foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-{{"00"}}"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 39,
              "endColumn": 55,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-{{\\"00\\"}}\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}{{#bar elementId="id-00"}}{{/bar}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 68,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{#bar elementId=\\"id-00\\"}}{{/bar}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo id="id-00"}}{{foo id="id-00"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{foo id=\\"id-00\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div id={{1234}}></div><div id={{1234}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 28,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{1234}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div id={{this.divId00}}></div><div id={{this.divId00}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 36,
              "endColumn": 55,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{this.divId00}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{partB}}partC"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 47,
              "endColumn": 77,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"{{\\"partA\\"}}{{partB}}partC\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}{{bar elementId="id-00"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 34,
              "endColumn": 59,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{bar elementId=\\"id-00\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}{{bar id="id-00"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 27,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "{{bar id=\\"id-00\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}<Bar id="id-00" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 32,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}<Bar @id="id-00" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 32,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "@id=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}<Bar @elementId="id-00" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 32,
              "endColumn": 50,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "@elementId=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: `
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
        <div id={{this.divId00}}></div>
      {{else}}
        <div id="other-thing"></div>
      {{/if}}
    `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 32,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{this.divId00}}",
            },
          ]
        `);
      },
    },
    {
      template: `
        <div id="id-00"></div>
        {{#if this.foo}}
          <div id="id-00"></div>
        {{/if}}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 25,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"id-00\\"",
            },
          ]
        `);
      },
    },
    {
      template: `
      <div id={{this.divId00}}></div>
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
      {{else}}
        <div id={{this.divId00}}></div>
      {{/if}}
    `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 32,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{this.divId00}}",
            },
            {
              "column": 13,
              "endColumn": 32,
              "endLine": 6,
              "filePath": "layout.hbs",
              "line": 6,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{this.divId00}}",
            },
          ]
        `);
      },
    },
    {
      template: `
        {{#if this.foo}}
          <div id="otherid"></div>
        {{else}}
          <div id="anidhere"></div>
        {{/if}}
        <div id="anidhere"></div>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 26,
              "endLine": 7,
              "filePath": "layout.hbs",
              "line": 7,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"anidhere\\"",
            },
          ]
        `);
      },
    },
    {
      template: `
        {{#if this.foo}}
          {{#if this.other}}
            <div id="nested"></div>
          {{/if}}
        {{else}}
          <div id="nested"></div>
        {{/if}}
        <div id="nested"></div>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 13,
              "endColumn": 24,
              "endLine": 9,
              "filePath": "layout.hbs",
              "line": 9,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id=\\"nested\\"",
            },
          ]
        `);
      },
    },
    {
      template: `
        <MyComponent as |inputProperties|>
          <Input id={{inputProperties.id}} />
          <Input id={{inputProperties.id}} />
        </MyComponent>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 42,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 4,
              "message": "ID attribute values must be unique",
              "rule": "no-duplicate-id",
              "severity": 2,
              "source": "id={{inputProperties.id}}",
            },
          ]
        `);
      },
    },
  ],
});
