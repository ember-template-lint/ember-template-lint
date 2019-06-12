'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/lint-table-groups').message;

generateRuleTests({
  name: 'table-groups',

  config: true,

  good: [
    `
    <table>
    {{#if showCaption}}
      <caption>Some Name</caption>
    {{/if}}
    {{#if foo}}
      <thead>
        <tr></tr>
      </thead>
    {{else}}
      <tbody>
        <tr></tr>
      </tbody>
    {{/if}}
    <colgroup></colgroup>
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

    ` <table>{{yield}}</table> `,
    '<table><!-- this --></table>',
    '<table>{{! or this }}</table>',
    '<table> </table>',
    '<table> <caption>Foo</caption></table>',
    '<table><colgroup><col style="background-color: red"></colgroup></table>',
    '<table><thead><tr><td>Header</td></tr></thead></table>',
    '<table><tbody><tr><td>Body</td></tr></tbody></table>',
    '<table><tfoot><tr><td>Footer</td></tr></tfoot></table>',
    '<table>' +
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
      result: {
        column: 6,
        line: 2,
        message: 'Tables must have a table group (thead, tbody or tfoot).',
        moduleId: 'layout.hbs',
        source:
          '<table>\n      {{#if showCaption}}\n        <thead>Some Name</thead>\n      {{/if}}\n      {{#if foo}}\n        <span>12</span>\n      {{else}}\n        <p>text</p>\n      {{/if}}\n      <colgroup></colgroup>\n      </table>',
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
      result: {
        column: 6,
        line: 2,
        message: 'Tables must have a table group (thead, tbody or tfoot).',
        moduleId: 'layout.hbs',
        source:
          '<table>\n      {{#if showCaption}}\n        <div>Some Name</div>\n      {{/if}}\n      {{#if foo}}\n        <span>12</span>\n      {{else}}\n        <p>text</p>\n      {{/if}}\n      <colgroup></colgroup>\n      </table>',
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
      result: {
        message,
        moduleId: 'layout.hbs',
        source:
          '<table>\n      {{#if foo}}\n        {{else}}\n        <div></div>\n      {{/if}}\n      </table>',
        line: 2,
        column: 6,
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
      result: {
        message,
        moduleId: 'layout.hbs',
        source:
          '<table>\n      {{#unless foo}}\n        <div>\n          <tr></tr>\n        </div>\n      {{/unless}}\n      </table>',
        line: 2,
        column: 6,
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
      result: {
        message,
        moduleId: 'layout.hbs',
        source:
          '<table>\n      {{#if foo}}\n        <div>\n          <tr></tr>\n        </div>\n      {{/if}}\n      </table>',
        line: 2,
        column: 6,
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
      result: {
        message,
        moduleId: 'layout.hbs',
        source:
          '<table>\n      {{#unless foo}}\n        {{some-component}}\n      {{/unless}}\n      </table>',
        line: 2,
        column: 6,
      },
    },
    {
      template: '<table><tr><td>Foo</td></tr></table>',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table><tr><td>Foo</td></tr></table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table>{{some-component}}</table>',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table>{{some-component}}</table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table>' + '<tr></tr>' + '<tbody><tr><td>Foo</td></tr></tbody>' + '</table>',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table>' + '<tr></tr>' + '<tbody><tr><td>Foo</td></tr></tbody>' + '</table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table> whitespace<thead></thead></table>',

      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table> whitespace<thead></thead></table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table>{{some-component tagName="div"}}</table>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table>{{some-component tagName="div"}}</table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table>{{some-component otherProp="tbody"}}</table>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table>{{some-component otherProp="tbody"}}</table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table><SomeComponent @tagName="div" /></table>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table><SomeComponent @tagName="div" /></table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table><SomeComponent @otherProp="tbody" /></table>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<table><SomeComponent @otherProp="tbody" /></table>',
        line: 1,
        column: 0,
      },
    },
  ],
});
