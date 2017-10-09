'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/lint-table-groups').message;

generateRuleTests({
  name: 'table-groups',

  config: true,

  good: [
    '<table> </table>',
    '<table><caption>Foo</caption></table>',
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
  ],

  bad: [
    {
      template: '<table><tr><td>Foo</td></tr></table>',

      result: {
        message: message,
        moduleId: 'layout.hbs',
        source: '<table><tr><td>Foo</td></tr></table>',
        line: 1,
        column: 0
      }
    },
    {
      template: '<table>{{some-component}}</table>',

      result: {
        message: message,
        moduleId: 'layout.hbs',
        source: '<table>{{some-component}}</table>',
        line: 1,
        column: 0
      }
    },
    {
      template: '<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>',

      result: {
        message: message,
        moduleId: 'layout.hbs',
        source: '<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>',
        line: 1,
        column: 0
      }
    },
    {
      template: '<table>' +
          '<tr></tr>' +
          '<tbody><tr><td>Foo</td></tr></tbody>' +
        '</table>',

      result: {
        message: message,
        moduleId: 'layout.hbs',
        source: '<table>' +
            '<tr></tr>' +
            '<tbody><tr><td>Foo</td></tr></tbody>' +
          '</table>',
        line: 1,
        column: 0
      }
    }
  ]
});
