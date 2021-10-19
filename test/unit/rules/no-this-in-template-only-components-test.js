'use strict';

const { message } = require('../../../lib/rules/no-this-in-template-only-components');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-this-in-template-only-components',

  config: true,

  meta: {
    filePath: 'app/components/foo.hbs',
  },

  good: [
    '{{welcome-page}}',
    '<WelcomePage />',
    '<MyComponent @prop={{can "edit" @model}} />',
    '{{my-component model=model}}',
    {
      template: '{{my-component model=this.model}}',
      meta: {
        filePath: 'app/templates/route-template.hbs',
      },
    },
  ],

  bad: [
    {
      template: '{{my-component model=this.model}}',
      fixedTemplate: '{{my-component model=@model}}',

      result: {
        filePath: 'app/components/foo.hbs',
        moduleId: 'layout',
        message: message('this.model', '@model'),
        source: 'this.model',
        line: 1,
        column: 21,
        isFixable: true,
      },
    },
    {
      template: '{{my-component action=(action this.myAction)}}',
      fixedTemplate: '{{my-component action=(action @myAction)}}',

      result: {
        filePath: 'app/components/foo.hbs',
        moduleId: 'layout',
        message: message('this.myAction', '@myAction'),
        source: 'this.myAction',
        line: 1,
        column: 30,
        isFixable: true,
      },
    },
    {
      template: '<MyComponent @prop={{can "edit" this.model}} />',
      fixedTemplate: '<MyComponent @prop={{can "edit" @model}} />',

      result: {
        filePath: 'app/components/foo.hbs',
        moduleId: 'layout',
        message: message('this.model', '@model'),
        source: 'this.model',
        line: 1,
        column: 32,
        isFixable: true,
      },
    },
    {
      template: '{{input id=(concat this.elementId "-username")}}',
      result: {
        filePath: 'app/components/foo.hbs',
        moduleId: 'layout',
        message: message('this.elementId', '@elementId'),
        source: 'this.elementId',
        line: 1,
        column: 19,
        isFixable: false,
      },
    },
    {
      template: '{{my-component model=this.model}}',
      fixedTemplate: '{{my-component model=@model}}',
      meta: {
        filePath: 'app/templates/components/some-component.hbs',
      },
      result: {
        filePath: 'app/templates/components/some-component.hbs',
        moduleId: 'layout',
        message: message('this.model', '@model'),
        source: 'this.model',
        line: 1,
        column: 21,
        isFixable: true,
      },
    },
    {
      template: '{{my-component model=this.model}}',
      fixedTemplate: '{{my-component model=@model}}',
      meta: {
        filePath: 'tests/dummy/app/templates/components/some-component.hbs',
      },
      result: {
        filePath: 'tests/dummy/app/templates/components/some-component.hbs',
        moduleId: 'layout',
        message: message('this.model', '@model'),
        source: 'this.model',
        line: 1,
        column: 21,
        isFixable: true,
      },
    },
    {
      template: '{{my-component model=this.model}}',
      fixedTemplate: '{{my-component model=@model}}',
      meta: {
        filePath: 'app/pods/components/some-component/template.hbs',
      },
      result: {
        filePath: 'app/pods/components/some-component/template.hbs',
        moduleId: 'layout',
        message: message('this.model', '@model'),
        source: 'this.model',
        line: 1,
        column: 21,
        isFixable: true,
      },
    },
  ],
});
