'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/style-concatenation').ERROR_MESSAGE;

generateRuleTests({
  name: 'style-concatenation',

  config: true,

  good: [
    '<img>',
    '<img style={{myStyle}}>',
    '<img style={{background-image url}}>',
    '<img style="background-image: url(/foo.png)"}}>',
    '<img style={{html-safe (concat "background-image: url(" url ")")}}>',
    '<img style={{html-safe (concat knownSafeStyle1 ";" knownSafeStyle2)}}>',
  ],

  bad: [
    {
      template: '<img style="{{myStyle}}">',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: 'style="{{myStyle}}"',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<img style="background-image: {{url}}">',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: 'style="background-image: {{url}}"',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<img style="{{background-image url}}">',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: 'style="{{background-image url}}"',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<img style={{concat knownSafeStyle1 ";" knownSafeStyle2}}>',

      result: {
        message: ERROR_MESSAGE,
        moduleId: 'layout.hbs',
        source: 'style={{concat knownSafeStyle1 ";" knownSafeStyle2}}',
        line: 1,
        column: 5,
      },
    },
  ],
});
