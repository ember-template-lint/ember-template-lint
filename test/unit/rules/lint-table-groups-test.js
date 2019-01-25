'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/lint-table-groups').message;

generateRuleTests({
  name: 'table-groups',

  config: true,

  good: [
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
      }
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
  ],
});
