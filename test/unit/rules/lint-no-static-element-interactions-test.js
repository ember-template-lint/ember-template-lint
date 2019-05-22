'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = 'Static HTML elements with event handlers require a role.';

generateRuleTests({
  name: 'no-static-element-interactions',

  config: true,

  good: [
    '<button onclick={{action "onButtonClick"}} class="foo"></button>',
    '<input type="text" {{action "onButtonClick"}}>',
    '<div {{action "foo-bar"}} role="button"></div>',
    '<div {{action "foo-bar"}} aria-interactive="button"></div>',
    '<div {{action "foo-bar" on=someValue}}></div>',
    '<div {{action "foo-bar" on="click"}} role="primary"></div>',
    '<div {{action "foo-bar" on="unknown"}}></div>',
    '<input type="text" {{on "click" (fn this.onButtonClick)}}>',
    '<div {{on "click" (fn this.onButtonClick)}} role="button"></div>',
    '<div {{on "click" (fn this.onButtonClick)}} aria-interactive="button"></div>',
    '<div {{on "click" (fn this.onButtonClick)}} role="primary"></div>',
    '<div {{on "mouseenter" (fn this.onButtonClick)}}></div>',
  ],

  bad: [
    {
      template: '<div onclick={{action "foo-bar"}}></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div onclick={{action "foo-bar"}}></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar" on="click"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar" on="click"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar" on="mouseDown"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar" on="mouseDown"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar" on="mouseUp"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar" on="mouseUp"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar" on="keyPress"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar" on="keyPress"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar" on="keyDown"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar" on="keyDown"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "foo-bar" on="keyUp"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "foo-bar" on="keyUp"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{action "click"}} {{action "foo-bar" on="keyUp"}} ></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{action "click"}} {{action "foo-bar" on="keyUp"}} ></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div onclick={{action "click"}}></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div onclick={{action "click"}}></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div {{on "click" (fn this.onButtonClick)}}></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source: '<div {{on "click" (fn this.onButtonClick)}}></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template:
        '<div {{on "mouseenter" (fn this.onButtonClick)}} {{on "click" (fn this.onButtonClick)}}></div>',
      result: {
        message,
        moduleId: 'layout.hbs',
        source:
          '<div {{on "mouseenter" (fn this.onButtonClick)}} {{on "click" (fn this.onButtonClick)}}></div>',
        line: 1,
        column: 0,
      },
    },
  ],
});
