'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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
        message: 'The HTML attribute role should never have the following value: command',
        moduleId: 'layout.hbs',
        source: '<img role="command">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="composite">',

      result: {
        message: 'The HTML attribute role should never have the following value: composite',
        moduleId: 'layout.hbs',
        source: '<img role="composite">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<input role="input">',

      result: {
        message: 'The HTML attribute role should never have the following value: input',
        moduleId: 'layout.hbs',
        source: '<input role="input">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="landmark">',

      result: {
        message: 'The HTML attribute role should never have the following value: landmark',
        moduleId: 'layout.hbs',
        source: '<img role="landmark">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<input role="range">',

      result: {
        message: 'The HTML attribute role should never have the following value: range',
        moduleId: 'layout.hbs',
        source: '<input role="range">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="roletype">',

      result: {
        message: 'The HTML attribute role should never have the following value: roletype',
        moduleId: 'layout.hbs',
        source: '<img role="roletype">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="section">',

      result: {
        message: 'The HTML attribute role should never have the following value: section',
        moduleId: 'layout.hbs',
        source: '<img role="section">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="sectionhead">',

      result: {
        message: 'The HTML attribute role should never have the following value: sectionhead',
        moduleId: 'layout.hbs',
        source: '<img role="sectionhead">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<select role="select"></select>',

      result: {
        message: 'The HTML attribute role should never have the following value: select',
        moduleId: 'layout.hbs',
        source: '<select role="select"></select>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="structure"></div>',

      result: {
        message: 'The HTML attribute role should never have the following value: structure',
        moduleId: 'layout.hbs',
        source: '<div role="structure"></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="widget">',

      result: {
        message: 'The HTML attribute role should never have the following value: widget',
        moduleId: 'layout.hbs',
        source: '<img role="widget">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img role="window">',

      result: {
        message: 'The HTML attribute role should never have the following value: window',
        moduleId: 'layout.hbs',
        source: '<img role="window">',
        line: 1,
        column: 0,
      },
    },
  ],
});
