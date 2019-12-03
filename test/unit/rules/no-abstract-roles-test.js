'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

function errMsg(roleName) {
  return `${roleName} is an abstract role, and is not a valid value for the role attribute.`;
}

generateRuleTests({
  name: 'no-abstract-roles',

  config: true,

  good: [
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
  ],

  bad: [
    {
      template: '<img role="command">',

      result: {
        message: errMsg('command'),
        moduleId: 'layout.hbs',
        source: '<img role="command">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="composite">',

      result: {
        message: errMsg('composite'),
        moduleId: 'layout.hbs',
        source: '<img role="composite">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<input role="input">',

      result: {
        message: errMsg('input'),
        moduleId: 'layout.hbs',
        source: '<input role="input">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="landmark">',

      result: {
        message: errMsg('landmark'),
        moduleId: 'layout.hbs',
        source: '<img role="landmark">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<input role="range">',

      result: {
        message: errMsg('range'),
        moduleId: 'layout.hbs',
        source: '<input role="range">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="roletype">',

      result: {
        message: errMsg('roletype'),
        moduleId: 'layout.hbs',
        source: '<img role="roletype">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="section">',

      result: {
        message: errMsg('section'),
        moduleId: 'layout.hbs',
        source: '<img role="section">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="sectionhead">',

      result: {
        message: errMsg('sectionhead'),
        moduleId: 'layout.hbs',
        source: '<img role="sectionhead">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<select role="select"></select>',

      result: {
        message: errMsg('select'),
        moduleId: 'layout.hbs',
        source: '<select role="select"></select>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="structure"></div>',

      result: {
        message: errMsg('structure'),
        moduleId: 'layout.hbs',
        source: '<div role="structure"></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="widget">',

      result: {
        message: errMsg('widget'),
        moduleId: 'layout.hbs',
        source: '<img role="widget">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="window">',

      result: {
        message: errMsg('window'),
        moduleId: 'layout.hbs',
        source: '<img role="window">',
        line: 1,
        column: 0,
      },
    },
  ],
});
