'use strict';

const ERROR_MESSAGE = require('../../../lib/rules/no-duplicate-id').ERROR_MESSAGE;
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-duplicate-id',

  config: true,

  good: [
    // Unique sibling TextNode IDs
    '<div id="id-00"></div><div id="id-01"></div>',

    // Mustache Statements
    '<div id={{"id-00"}}></div>',
    '<div id={{"id-00"}}></div><div id={{"id-01"}}></div>',
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
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="id-00"',
      },
    },
    {
      template: '<div><div id="id-01"></div></div><div><div id="id-01"></div></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 43,
        source: 'id="id-01"',
      },
    },
    {
      template: '<div id="id-00"></div><div id={{"id-00"}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id={{"id-00"}}',
      },
    },
    {
      template: '<div id={{"id-00"}}></div><div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 31,
        source: 'id="id-00"',
      },
    },
    {
      template: '<div id="id-00"></div><div id="id-{{"00"}}"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="id-{{"00"}}"',
      },
    },
    {
      template: '<div id="id-00"></div><div id="{{"id"}}-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="{{"id"}}-00"',
      },
    },
    {
      template: '<div id="id-00"></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 22,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id="id-00"',
      },
    },
    {
      template: '<div id={{"id-00"}}></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 26,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id={{"id-00"}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id={{"id-00"}}',
      },
    },
    {
      template: '<div id="id-{{"00"}}"></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 28,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-{{"00"}}"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id="id-{{"00"}}"',
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}{{#bar elementId="id-00"}}{{/bar}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: '{{#bar elementId="id-00"}}{{/bar}}',
      },
    },
    {
      template: '{{foo id="id-00"}}{{foo id="id-00"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 18,
        source: '{{foo id="id-00"}}',
      },
    },
    {
      template: '<div id={{1234}}></div><div id={{1234}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 28,
        source: 'id={{1234}}',
      },
    },
    {
      template: '<div id={{this.divId00}}></div><div id={{this.divId00}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 36,
        source: 'id={{this.divId00}}',
      },
    },
    {
      template:
        '<div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{partB}}partC"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 47,
        source: 'id="{{"partA"}}{{partB}}partC"',
      },
    },
    {
      template: '{{#foo elementId="id-00"}}{{/foo}}{{bar elementId="id-00"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: '{{bar elementId="id-00"}}',
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}{{bar id="id-00"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: '{{bar id="id-00"}}',
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}<Bar id="id-00" />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 32,
        source: 'id="id-00"',
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}<Bar @id="id-00" />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 32,
        source: '@id="id-00"',
      },
    },
    {
      template: '{{#foo id="id-00"}}{{/foo}}<Bar @elementId="id-00" />',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 32,
        source: '@elementId="id-00"',
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
      result: {
        message: ERROR_MESSAGE,
        line: 4,
        column: 13,
        source: 'id={{this.divId00}}',
      },
    },
    {
      template: `
        <div id="id-00"></div>
        {{#if this.foo}}
          <div id="id-00"></div>
        {{/if}}
      `,
      result: {
        message: ERROR_MESSAGE,
        line: 4,
        column: 15,
        source: 'id="id-00"',
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
      results: [
        {
          message: ERROR_MESSAGE,
          line: 4,
          column: 13,
          source: 'id={{this.divId00}}',
        },
        {
          message: ERROR_MESSAGE,
          line: 6,
          column: 13,
          source: 'id={{this.divId00}}',
        },
      ],
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
      result: {
        message: ERROR_MESSAGE,
        line: 7,
        column: 13,
        source: 'id="anidhere"',
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
      result: {
        message: ERROR_MESSAGE,
        line: 9,
        column: 13,
        source: 'id="nested"',
      },
    },
    {
      template: `
        <MyComponent as |inputProperties|>
          <Input id={{inputProperties.id}} />
          <Input id={{inputProperties.id}} />
        </MyComponent>
      `,
      result: {
        message: ERROR_MESSAGE,
        line: 4,
        column: 17,
        source: 'id={{inputProperties.id}}',
      },
    },
  ],
});
