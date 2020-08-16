'use strict';

const { generateErrorMessage } = require('../../../lib/rules/no-potential-path-strings');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-potential-path-strings',

  config: true,

  good: [
    '<img src="foo.png">',
    '<img src={{picture}}>',
    '<img src={{this.picture}}>',
    '<img src={{@img}}>',
    '<SomeComponent @foo={{@bar}} />',
  ],

  bad: [
    {
      template: '<img src="this.picture">',
      result: {
        message: generateErrorMessage('this.picture'),
        line: 1,
        column: 10,
        source: 'this.picture',
      },
    },
    {
      template: '<img src=this.picture>',
      result: {
        message: generateErrorMessage('this.picture'),
        line: 1,
        column: 9,
        source: 'this.picture',
      },
    },
    {
      template: '<img src="@img">',
      result: {
        message: generateErrorMessage('@img'),
        line: 1,
        column: 10,
        source: '@img',
      },
    },
    {
      template: '<img src=@img>',
      result: {
        message: generateErrorMessage('@img'),
        line: 1,
        column: 9,
        source: '@img',
      },
    },
    {
      template: '<SomeComponent @foo=@bar />',
      result: {
        message: generateErrorMessage('@bar'),
        line: 1,
        column: 20,
        source: '@bar',
      },
    },
    {
      template: '<SomeComponent @foo=this.bar />',
      result: {
        message: generateErrorMessage('this.bar'),
        line: 1,
        column: 20,
        source: 'this.bar',
      },
    },
  ],
});
