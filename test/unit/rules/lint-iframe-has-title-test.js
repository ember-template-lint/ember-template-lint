'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'iframe-has-title',

  config: true,

  good: ['<iframe title="Welcome to the Matrix!" />', '<iframe title={{someValue}} />'],

  bad: [
    {
      template: '<iframe src="12" />',

      result: {
        message: '<iframe> elements must have a unique title property.',
        moduleId: 'layout.hbs',
        source: '<iframe src="12" />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<iframe src="12" title={{false}} />',

      result: {
        message: '<iframe> elements must have a unique title property.',
        moduleId: 'layout.hbs',
        source: '<iframe src="12" title={{false}} />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<iframe src="12" title="{{false}}" />',

      result: {
        message: '<iframe> elements must have a unique title property.',
        moduleId: 'layout.hbs',
        source: '<iframe src="12" title="{{false}}" />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<iframe src="12" title="" />',

      result: {
        message: '<iframe> elements must have a unique title property.',
        moduleId: 'layout.hbs',
        source: '<iframe src="12" title="" />',
        line: 1,
        column: 0,
      },
    },
  ],
});
