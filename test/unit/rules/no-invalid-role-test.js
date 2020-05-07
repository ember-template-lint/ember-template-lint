'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/no-invalid-role');

const { createErrorMessageDisallowedRoleForElement, createInvalidRoleErrorMessage } = rule;

generateRuleTests({
  name: 'no-invalid-role',

  config: true,

  good: [
    '<div></div>',
    '<div role="none"></div>',
    '<div role="presentation"></div>',
    '<img alt="" role="none">',
    '<img role="none">',
    '<img alt="" role="presentation">',
    '<img role="presentation">',
    '<span role="none"></span>',
    '<span role="presentation"></span>',
    '<svg role="none"></svg>',
    '<svg role="presentation"></svg>',
    '<custom-component role="none"></custom-component>',
    '<AwesomeThing role="none"></AwesomeThing>',
    '<AwesomeThing role="presentation"></AwesomeThing>',
    '<table role="textbox"></table>', // Random role on this element.
    {
      config: {
        catchInvalidRoles: false,
      },
      template: '<div role="command interface"></div>',
    },
  ],

  bad: [
    {
      template: '<ul role="presentation"></ul>',
      result: {
        message: createErrorMessageDisallowedRoleForElement('ul'),
        source: '<ul role="presentation"></ul>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<ol role="presentation"></ol>',
      result: {
        message: createErrorMessageDisallowedRoleForElement('ol'),
        source: '<ol role="presentation"></ol>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<li role="presentation"></li>',
      result: {
        message: createErrorMessageDisallowedRoleForElement('li'),
        source: '<li role="presentation"></li>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table role="presentation"></table>',
      result: {
        message: createErrorMessageDisallowedRoleForElement('table'),
        source: '<table role="presentation"></table>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<table role="none"></table>',
      result: {
        message: createErrorMessageDisallowedRoleForElement('table'),
        source: '<table role="none"></table>',
        line: 1,
        column: 0,
      },
    },

    {
      template: '<div role="command interface"></div>',
      config: {
        catchInvalidRoles: true,
      },
      result: {
        message: createInvalidRoleErrorMessage('div'),
        source: '<div role="command interface"></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="COMMAND INTERFACE"></div>',
      config: {
        catchInvalidRoles: true,
      },
      result: {
        message: createInvalidRoleErrorMessage('div'),
        source: '<div role="COMMAND INTERFACE"></div>',
        line: 1,
        column: 0,
      },
    },
  ],
});
