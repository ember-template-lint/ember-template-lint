'use strict';

const { createTableGroupsErrorMessage } = require('../../../lib/rules/table-groups');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'table-groups',

  config: true,

  good: [
    `
    <table>
    {{#if showCaption}}
      <caption>Some Name</caption>
    {{/if}}
    <colgroup></colgroup>
    {{#if foo}}
      <thead>
        <tr></tr>
      </thead>
    {{else}}
      <tbody>
        <tr></tr>
      </tbody>
    {{/if}}
    </table>
    `,
    `
    <table>
    {{#if foo}}
      <tfoot>
        <tr></tr>
      </tfoot>
    {{/if}}
    </table>
    `,
    `
    <table>
    {{#unless foo}}
      <tfoot>
        <tr></tr>
      </tfoot>
    {{/unless}}
    </table>
    `,
    `
    <table>
    {{#each foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/each}}
    </table>
    `,
    `
    <table>
    {{#each-in foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/each-in}}
    </table>
    `,
    `
    <table>
    {{#let foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/let}}
    </table>
    `,
    `
    <table>
    {{#with foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/with}}
    </table>
    `,
    `
    <table>
    {{#each foo as |bar|}}
      {{#if bar}}
        {{#unless baz}}
          <tfoot>
            <tr>bar</tr>
          </tfoot>
        {{/unless}}
      {{/if}}
    {{/each}}
    </table>
    `,

    // Component with tag:
    '<table>{{some-component tagName="tbody"}}</table>',
    '<table>{{some-component tagName="thead"}}</table>',
    '<table>{{some-component tagName="tfoot"}}</table>',

    // Block statement component with tag:
    '<table>{{#some-component tagName="tbody"}}{{/some-component}}</table>',
    '<table>{{#some-component tagName="thead"}}{{/some-component}}</table>',
    '<table>{{#some-component tagName="tfoot"}}{{/some-component}}</table>',

    // Component helper with tag:
    '<table>{{component "some-component" tagName="tbody"}}</table>',
    '<table>{{component "some-component" tagName="thead"}}</table>',
    '<table>{{component "some-component" tagName="tfoot"}}</table>',

    // Angle bracket component (self-closing) with tag:
    '<table><SomeComponent @tagName="tbody" /></table>',
    '<table><SomeComponent @tagName="thead" /></table>',
    '<table><SomeComponent @tagName="tfoot" /></table>',

    // Angle bracket component (NOT self-closing) with tag:
    '<table><SomeComponent @tagName="tbody"></SomeComponent></table>',
    '<table><SomeComponent @tagName="thead"></SomeComponent></table>',
    '<table><SomeComponent @tagName="tfoot"></SomeComponent></table>',

    ' <table>{{yield}}</table> ',
    '<table><!-- this --></table>',
    '<table>{{! or this }}</table>',
    '<table> </table>',
    '<table> <caption>Foo</caption></table>',
    '<table><colgroup><col style="background-color: red"></colgroup></table>',
    '<table><thead><tr><td>Header</td></tr></thead></table>',
    '<table><tbody><tr><td>Body</td></tr></tbody></table>',
    '<table><tfoot><tr><td>Footer</td></tr></tfoot></table>',
    '<table>' +
      '{{! this is a comment }}' +
      '<thead>' +
      '<tr><td>Header</td></tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr><td>Body</td></tr>' +
      '</tbody>' +
      '<tfoot>' +
      '<tr><td>Footer</td></tr>' +
      '</tfoot>' +
      '</table>',
    '<table>' +
      '<colgroup>' +
      '<col style="background-color: red">' +
      '</colgroup>' +
      '<tbody>' +
      '<tr><td>Body</td></tr>' +
      '</tbody>' +
      '</table>',
    '<table>\n' + '<tbody>\n' + '</tbody>\n' + '</table>',
    '<table><colgroup></colgroup><colgroup></colgroup><tbody></tbody></table>',
    {
      config: {
        'allowed-caption-components': ['nested/my-caption'],
        'allowed-colgroup-components': ['nested/my-colgroup'],
        'allowed-thead-components': ['nested/my-thead'],
        'allowed-tbody-components': ['nested/my-tbody'],
        'allowed-tfoot-components': ['nested/my-tfoot'],
      },
      template: `
      <table>
        <Nested::MyCaption />
        <Nested::MyColgroup />
        <Nested::MyThead />
        <Nested::MyTbody />
        <Nested::MyTfoot />
      </table>
      `,
    },
    {
      config: {
        'allowed-caption-components': ['nested/my-caption'],
        'allowed-colgroup-components': ['nested/my-colgroup'],
        'allowed-thead-components': ['nested/my-thead'],
        'allowed-tbody-components': ['nested/my-tbody'],
        'allowed-tfoot-components': ['nested/my-tfoot'],
      },
      template: `
      <table>
        {{nested/my-caption}}
        {{nested/my-colgroup}}
        {{nested/my-thead}}
        {{nested/my-tbody}}
        {{nested/my-tfoot}}
      </table>
      `,
    },
    {
      config: {
        'allowed-thead-components': ['nested/head-or-foot'],
        'allowed-tbody-components': ['nested/body'],
        'allowed-tfoot-components': ['nested/head-or-foot'],
      },
      template: `
      <table>
        <Nested::HeadOrFoot />
        <Nested::Body />
        <Nested::HeadOrFoot/>
      </table>
      `,
    },
    {
      config: {
        'allowed-caption-components': ['nested/my-caption'],
      },
      template: `
      <table>
        <Nested::MyCaption />
        <thead />
        <Nested::MyCaption @tagName="tbody" />
        <tfoot />
      </table>
      `,
    },
  ],

  bad: [
    {
      template: `
      <table>
      {{#if showCaption}}
        <thead>Some Name</thead>
      {{/if}}
      {{#if foo}}
        <span>12</span>
      {{else}}
        <p>text</p>
      {{/if}}
      <colgroup></colgroup>
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 12,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#if showCaption}}
                  <thead>Some Name</thead>
                {{/if}}
                {{#if foo}}
                  <span>12</span>
                {{else}}
                  <p>text</p>
                {{/if}}
                <colgroup></colgroup>
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: `
      <table>
      {{#if showCaption}}
        <div>Some Name</div>
      {{/if}}
      {{#if foo}}
        <span>12</span>
      {{else}}
        <p>text</p>
      {{/if}}
      <colgroup></colgroup>
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 12,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#if showCaption}}
                  <div>Some Name</div>
                {{/if}}
                {{#if foo}}
                  <span>12</span>
                {{else}}
                  <p>text</p>
                {{/if}}
                <colgroup></colgroup>
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: `
      <table>
      {{#if foo}}
        {{else}}
        <div></div>
      {{/if}}
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 7,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#if foo}}
                  {{else}}
                  <div></div>
                {{/if}}
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: `
      <table>
      {{#unless foo}}
        <div>
          <tr></tr>
        </div>
      {{/unless}}
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 8,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#unless foo}}
                  <div>
                    <tr></tr>
                  </div>
                {{/unless}}
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: `
      <table>
      {{#if foo}}
        <div>
          <tr></tr>
        </div>
      {{/if}}
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 8,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#if foo}}
                  <div>
                    <tr></tr>
                  </div>
                {{/if}}
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: `
      <table>
      {{#unless foo}}
        {{some-component}}
      {{/unless}}
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 6,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#unless foo}}
                  {{some-component}}
                {{/unless}}
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: `
      <table>
      {{#something foo}}
        <tbody></tbody>
      {{/something}}
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 6,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                {{#something foo}}
                  <tbody></tbody>
                {{/something}}
                </table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table><tr><td>Foo</td></tr></table>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table><tr><td>Foo</td></tr></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table>{{some-component}}</table>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>{{some-component}}</table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table>' + '<tr></tr>' + '<tbody><tr><td>Foo</td></tr></tbody>' + '</table>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 60,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table><tr></tr><tbody><tr><td>Foo</td></tr></tbody></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table> whitespace<thead></thead></table>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table> whitespace<thead></thead></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table>{{some-component tagName="div"}}</table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>{{some-component tagName=\\"div\\"}}</table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table>{{some-component otherProp="tbody"}}</table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>{{some-component otherProp=\\"tbody\\"}}</table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table><SomeComponent @tagName="div" /></table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table><SomeComponent @tagName=\\"div\\" /></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table><SomeComponent @otherProp="tbody" /></table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table><SomeComponent @otherProp=\\"tbody\\" /></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table>some text</table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>some text</table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table><tfoot /><thead /></table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table><tfoot /><thead /></table>",
            },
          ]
        `);
      },
    },
    {
      template: '<table><tbody /><caption /></table>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table><tbody /><caption /></table>",
            },
          ]
        `);
      },
    },
    {
      template: `
        <table>
          <tbody />
          <colgroup />
        </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 16,
              "endLine": 5,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                    <tbody />
                    <colgroup />
                  </table>",
            },
          ]
        `);
      },
    },
    {
      config: {
        'allowed-caption-components': ['nested/allowed'],
      },
      template: `
      <table>
        <Nested::SomethingElse />
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 4,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have a table group (thead, tbody or tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                  <Nested::SomethingElse />
                </table>",
            },
          ]
        `);
      },
    },
    {
      config: {
        'allowed-thead-components': ['nested/my-thead'],
        'allowed-tfoot-components': ['nested/my-tfoot'],
      },
      template: `
      <table>
        <Nested::MyTfoot />
        <Nested::MyThead />
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 5,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                  <Nested::MyTfoot />
                  <Nested::MyThead />
                </table>",
            },
          ]
        `);
      },
    },
    {
      config: {
        'allowed-thead-components': ['nested/head-or-foot'],
        'allowed-tbody-components': ['nested/body'],
        'allowed-tfoot-components': ['nested/head-or-foot'],
      },
      template: `
      <table>
        <Nested::HeadOrFoot />
        <Nested::Body />
        <Nested::HeadOrFoot/>
        <Nested::Body />
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 7,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                  <Nested::HeadOrFoot />
                  <Nested::Body />
                  <Nested::HeadOrFoot/>
                  <Nested::Body />
                </table>",
            },
          ]
        `);
      },
    },
    {
      config: {
        'allowed-tbody-components': ['nested/my-tbody'],
      },
      template: `
      <table>
        <thead />
        <Nested::MyTbody @tagName="caption" />
        <tbody />
      </table>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 6,
              "endColumn": 14,
              "endLine": 6,
              "filePath": "layout.hbs",
              "line": 2,
              "message": "Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).",
              "rule": "table-groups",
              "severity": 2,
              "source": "<table>
                  <thead />
                  <Nested::MyTbody @tagName=\\"caption\\" />
                  <tbody />
                </table>",
            },
          ]
        `);
      },
    },
  ],

  error: [
    {
      // If none of the keys are recognized, they should just use `true`.
      config: {
        'invalid-key': ['nested/my-component'],
      },
      template: 'test',
      result: {
        fatal: true,
        message: createTableGroupsErrorMessage('table-groups', {
          'invalid-key': ['nested/my-component'],
        }),
      },
    },
    {
      // The allowed components needs to be wrapped in an array.
      config: {
        'allowed-thead-components': 'string',
      },
      template: 'test',
      result: {
        fatal: true,
        message: createTableGroupsErrorMessage('table-groups', {
          'allowed-thead-components': 'string',
        }),
      },
    },
    {
      // The allowed components needs to be an array of strings.
      config: {
        'allowed-thead-components': [5],
      },
      template: 'test',
      result: {
        fatal: true,
        message: createTableGroupsErrorMessage('table-groups', {
          'allowed-thead-components': [5],
        }),
      },
    },
    {
      // The allowed components should be dasherized (nested/my-thead).
      config: {
        'allowed-thead-components': ['Nested::MyThead'],
        'allowed-tfoot-components': ['Nested::MyTfoot'],
      },
      template: 'test',
      result: {
        fatal: true,
        message: createTableGroupsErrorMessage('table-groups', {
          'allowed-thead-components': ['Nested::MyThead'],
          'allowed-tfoot-components': ['Nested::MyTfoot'],
        }),
      },
    },
  ],
});
